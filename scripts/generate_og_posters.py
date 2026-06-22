"""
generate_og_posters.py — Auto-generate static OG/social-card posters from a
page's hero <video> (MP4), using ffmpeg's `thumbnail` filter.

Social crawlers (Slack, iMessage, Discord, X, LinkedIn, Facebook) never render
video as a link-preview card — they only read a static `og:image`. Lessons whose
opening hero is an MP4 <video> therefore fall back to the generic site card. This
script extracts a representative still from each such video and wires it in as the
page's `image:` front matter so those pages get a real, page-specific preview.

What it does, for every .md page whose FIRST media element is an MP4 <video>:
  1. Resolves the hero .mp4 path (handles relative paths, `../`, and
     `{{ site.baseurl }}`).
  2. Runs `ffmpeg -vf thumbnail` to pick the most representative frame from the
     opening of the clip (more robust than the literal first frame, which is
     often a black fade-in or title card) and writes it to
     `<module>/assets/og/<lesson>.jpg`.
  3. Sets (or replaces) the page's `image:` front matter to that poster path,
     overriding any incidental static figure previously used as the card — the
     hero still is the most representative image for the page.

Pages whose hero is a GIF, a static image, or a YouTube embed are left alone
(GIFs and static images already work as `image:`; YouTube uses its hqdefault
thumbnail — see the "SEO and social cards" section of website-dev.md).

Requires `ffmpeg` on PATH (tested with ffmpeg 6.0).

Usage:
    python scripts/generate_og_posters.py                 # dry run, whole site
    python scripts/generate_og_posters.py --run            # apply, whole site
    python scripts/generate_og_posters.py --run --force    # re-encode even fresh posters
    python scripts/generate_og_posters.py arduino/serial-print.md arduino/debouncing.md
    python scripts/generate_og_posters.py --run arduino/serial-print.md

Posters are COMMITTED assets, not a build step — the Jekyll build (local or the
GitHub Actions deploy) just copies them like any other image and never runs
ffmpeg, so this script never affects build time. Re-running it is cheap and
idempotent: a poster is only regenerated when it is missing or older than its
source .mp4 (override with --force). Run this only after adding/swapping a hero
video, then commit the resulting .jpg.

Always run dry first and inspect the generated images + `git diff` after applying.
"""

import re
import subprocess
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

DOCS_DIR = "."  # repo root, relative to where the script is run

# Directories to skip when scanning the whole site.
SKIP_DIRS = {"_site", ".git", "node_modules", "vendor", ".jekyll-cache"}

# ffmpeg frame-selection filter. `thumbnail` scans a batch of frames and picks
# the one most representative (by histogram), which avoids black/blank intros.
FFMPEG_VF = "thumbnail"

# ---------------------------------------------------------------------------
# Patterns
# ---------------------------------------------------------------------------

HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)

# Front matter block: opening --- ... closing --- at the very top of the file.
FRONT_MATTER_RE = re.compile(r"^(---\s*\n)(.*?)(\n---\s*\n)", re.DOTALL)

# The first "media element" of any kind. Whichever matches earliest in the body
# is treated as the page's hero.
MEDIA_TOKEN_RE = re.compile(r"<video\b|!\[|<img\b|<iframe\b", re.IGNORECASE)

# An MP4 <source> inside a <video> block.
MP4_SOURCE_RE = re.compile(r'<source\b[^>]*\bsrc="([^"]*\.mp4)"', re.IGNORECASE)

# An existing `image:` line within front matter.
IMAGE_LINE_RE = re.compile(r"^image:.*$", re.MULTILINE)
# The `title:` line, used as the insertion anchor (matches our convention of
# placing description/image right after the title).
TITLE_LINE_RE = re.compile(r"^title:.*$", re.MULTILINE)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def split_front_matter(content):
    """Return (fm_text, body_text, match) or (None, content, None) if no FM."""
    m = FRONT_MATTER_RE.match(content)
    if not m:
        return None, content, None
    return m.group(2), content[m.end():], m


def find_hero_mp4(body):
    """If the page's first media element is an MP4 <video>, return its raw src.

    Returns the src string (as written in the markdown) or None.
    """
    # Ignore commented-out media (e.g. an MP4 left in an HTML comment above a GIF).
    visible = HTML_COMMENT_RE.sub("", body)

    first = MEDIA_TOKEN_RE.search(visible)
    if not first:
        return None
    # Hero is only an MP4 candidate if the earliest media token is a <video>.
    if not visible[first.start():first.end()].lower().startswith("<video"):
        return None

    # Find the mp4 <source> belonging to that opening <video> (search forward).
    src = MP4_SOURCE_RE.search(visible, first.start())
    return src.group(1) if src else None


def resolve_mp4_path(raw_src, md_path):
    """Resolve a hero src (relative / `../` / `{{ site.baseurl }}`) to a real file."""
    src = raw_src.strip()
    src = re.sub(r"\{\{\s*site\.baseurl\s*\}\}", "", src).strip()

    if src.startswith("/"):
        # Root-absolute (relative to repo root).
        candidate = Path(DOCS_DIR) / src.lstrip("/")
    else:
        # Relative to the markdown file's directory.
        candidate = (md_path.parent / src)
    return candidate.resolve()


def poster_paths(md_path):
    """Return (poster_file_on_disk, image_frontmatter_value) for a page."""
    module_dir = md_path.parent
    poster_file = module_dir / "assets" / "og" / f"{md_path.stem}.jpg"
    # Root-absolute path for front matter (jekyll-seo-tag prepends url+baseurl).
    rel = poster_file.relative_to(Path(DOCS_DIR).resolve()) \
        if poster_file.is_absolute() else poster_file
    image_value = "/" + str(rel).replace("\\", "/")
    return poster_file, image_value


def run_ffmpeg(mp4_path, poster_file):
    """Extract a representative frame; returns True on success."""
    poster_file.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(mp4_path),
        "-vf", FFMPEG_VF,
        "-frames:v", "1",
        "-q:v", "2",
        str(poster_file),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"      ffmpeg ERROR: {result.stderr.strip()}")
        return False
    return True


def set_image_frontmatter(content, image_value):
    """Set/replace the `image:` key in the page's front matter."""
    fm_text, body, m = split_front_matter(content)
    if fm_text is None:
        return content, False  # no front matter; leave untouched

    new_line = f"image: {image_value}"
    if IMAGE_LINE_RE.search(fm_text):
        new_fm = IMAGE_LINE_RE.sub(new_line, fm_text, count=1)
    else:
        title = TITLE_LINE_RE.search(fm_text)
        if title:
            insert_at = title.end()
            new_fm = fm_text[:insert_at] + "\n" + new_line + fm_text[insert_at:]
        else:
            new_fm = new_line + "\n" + fm_text

    if new_fm == fm_text:
        return content, False
    new_content = m.group(1) + new_fm + m.group(3) + body
    return new_content, True


# ---------------------------------------------------------------------------
# File processing
# ---------------------------------------------------------------------------


def iter_markdown(targets):
    """Yield Path objects for the .md files to process."""
    if targets:
        for t in targets:
            p = Path(t)
            if p.is_file():
                yield p
            else:
                print(f"  WARNING: not found, skipping: {t}")
        return
    for p in sorted(Path(DOCS_DIR).rglob("*.md")):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        yield p


def poster_is_fresh(poster_file, mp4_path):
    """True if the poster exists and is at least as new as its source video."""
    return (
        poster_file.exists()
        and poster_file.stat().st_mtime >= mp4_path.stat().st_mtime
    )


def process_files(targets, dry_run=True, force=False):
    stats = {"scanned": 0, "candidates": 0, "posters": 0,
             "fresh": 0, "frontmatter": 0}

    for md_path in iter_markdown(targets):
        stats["scanned"] += 1
        content = md_path.read_text(encoding="utf-8")
        _, body, _ = split_front_matter(content)

        raw_src = find_hero_mp4(body)
        if not raw_src:
            continue
        stats["candidates"] += 1

        mp4_path = resolve_mp4_path(raw_src, md_path)
        if not mp4_path.exists():
            print(f"  SKIP {md_path} - hero mp4 not found: {raw_src}")
            continue

        poster_file, image_value = poster_paths(md_path)
        fresh = poster_is_fresh(poster_file, mp4_path)
        regen = force or not fresh

        if not regen:
            stats["fresh"] += 1
            print(f"  [FRESH]   {md_path} - poster up to date, skipping")
            # Still ensure front matter points at it (idempotent).
            if not dry_run:
                new_content, changed = set_image_frontmatter(content, image_value)
                if changed:
                    md_path.write_text(new_content, encoding="utf-8")
                    stats["frontmatter"] += 1
            continue

        verb = "RE-ENCODE" if (fresh and force) else "GENERATE"
        tag = "[DRY RUN] " if dry_run else "[UPDATED] "
        print(f"  {tag}{md_path} - {verb}")
        print(f"      hero : {mp4_path}")
        print(f"      poster: {poster_file}")
        print(f"      image: {image_value}")

        if dry_run:
            continue

        if run_ffmpeg(mp4_path, poster_file):
            stats["posters"] += 1
            new_content, changed = set_image_frontmatter(content, image_value)
            if changed:
                md_path.write_text(new_content, encoding="utf-8")
                stats["frontmatter"] += 1

    return stats


def print_summary(stats, dry_run):
    mode = "DRY RUN" if dry_run else "COMPLETE"
    print(f"\n{'=' * 60}")
    print(f"  {mode} SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Files scanned:            {stats['scanned']}")
    print(f"  MP4-hero candidates:      {stats['candidates']}")
    print(f"  Already fresh (skipped):  {stats['fresh']}")
    if not dry_run:
        print(f"  Posters generated:        {stats['posters']}")
        print(f"  Front matter updated:     {stats['frontmatter']}")
    print(f"{'=' * 60}")
    if dry_run and (stats["candidates"] - stats["fresh"]) > 0:
        print("  Re-run with --run to generate posters and set `image:`.")


if __name__ == "__main__":
    flags = {"--run", "--force"}
    args = [a for a in sys.argv[1:] if a not in flags]
    dry_run = "--run" not in sys.argv
    force = "--force" in sys.argv
    stats = process_files(args, dry_run=dry_run, force=force)
    print_summary(stats, dry_run)
