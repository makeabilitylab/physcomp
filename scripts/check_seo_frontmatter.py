"""
check_seo_frontmatter.py — CI gate: every published page must set `description:`.

Per-page `description:` (and, where possible, `image:`) drives search snippets and
social link-preview cards via jekyll-seo-tag. This script enforces the convention so
new content (and in-flight branches) can't quietly regress to the generic site card.
See the "SEO and social cards" section of website-dev.md.

Rules:
  - A "page" = a .md file with YAML front matter containing `layout:`.
  - Every page MUST have a non-empty `description:` — EXCEPT:
      * pages marked draft via `nav_exclude: true` or `search_exclude: true`, and
      * paths in IGNORE (contributor docs, deprecated pages).
    A draft becomes subject to the rule as soon as it's published (nav_exclude removed).
  - `image:` is ADVISORY: a page whose hero is an MP4 <video> but has no `image:`
    yet gets a non-fatal reminder to run scripts/generate_og_posters.py. Pages may
    legitimately have no image (they fall back to the site card).

Exit code: 1 if any required page is missing `description:` (fails the CI check);
0 otherwise. Advisory image reminders never affect the exit code.

Usage:
    python scripts/check_seo_frontmatter.py
"""

import re
import sys
from pathlib import Path

DOCS_DIR = "."
SKIP_DIRS = {"_site", ".git", "node_modules", "vendor", ".jekyll-cache",
             "scripts", "_includes", "_layouts", "_data", "_sass", "assets"}

# Pages exempt from the description: requirement (contributor docs, deprecated).
IGNORE = {
    "website-dev.md", "website-install.md", "teaching-notes.md",
    "website-content-ideas.md", "README.md", "LICENSE.md", "CLAUDE.md",
    "404.md", "arduino/potentiometers-old.md",
}

FRONT_MATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
MEDIA_TOKEN_RE = re.compile(r"<video\b|!\[|<img\b|<iframe\b", re.IGNORECASE)
MP4_SOURCE_RE = re.compile(r'<source\b[^>]*\.mp4"', re.IGNORECASE)


def front_matter(content):
    m = FRONT_MATTER_RE.match(content)
    return (m.group(1), content[m.end():]) if m else (None, content)


def fm_has(fm, key):
    """True if front matter has a non-empty value for `key`."""
    m = re.search(rf"^{key}:\s*(.+?)\s*$", fm, re.MULTILINE)
    return bool(m and m.group(1).strip() not in ("", '""', "''"))


def fm_true(fm, key):
    return bool(re.search(rf"^{key}:\s*true\s*$", fm, re.MULTILINE | re.IGNORECASE))


def hero_is_mp4(body):
    visible = HTML_COMMENT_RE.sub("", body)
    first = MEDIA_TOKEN_RE.search(visible)
    if not first or not visible[first.start():first.end()].lower().startswith("<video"):
        return False
    return bool(MP4_SOURCE_RE.search(visible, first.start()))


def rel(p):
    return str(p).replace("\\", "/").lstrip("./")


def main():
    missing_desc = []
    image_reminders = []
    checked = 0

    for path in sorted(Path(DOCS_DIR).rglob("*.md")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        relpath = rel(path)
        if relpath in IGNORE:
            continue

        fm, body = front_matter(path.read_text(encoding="utf-8"))
        if fm is None or not re.search(r"^layout:", fm, re.MULTILINE):
            continue  # not a page
        if fm_true(fm, "nav_exclude") or fm_true(fm, "search_exclude"):
            continue  # draft / hidden

        checked += 1
        if not fm_has(fm, "description"):
            missing_desc.append(relpath)
        if not fm_has(fm, "image") and hero_is_mp4(body):
            image_reminders.append(relpath)

    print(f"Checked {checked} published page(s).")

    if image_reminders:
        print(f"\nReminder ({len(image_reminders)}): MP4-hero page(s) with no `image:` "
              f"— run `python scripts/generate_og_posters.py --run`:")
        for p in image_reminders:
            print(f"  - {p}")

    if missing_desc:
        print(f"\nERROR: {len(missing_desc)} published page(s) missing `description:` "
              f"front matter:")
        for p in missing_desc:
            print(f"  - {p}")
        print("\nAdd a `description:` (see website-dev.md -> 'SEO and social cards'). "
              "Drafts can set `nav_exclude: true` to defer.")
        return 1

    print("\nAll published pages have `description:`. OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
