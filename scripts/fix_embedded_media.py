"""
fix_embedded_media.py — Fix embedded media issues across Jekyll markdown files.

Scans all .md files under DOCS_DIR for two issues:

  1. Inline video styles: strips redundant `style="margin:0px"` from <video>
     elements (already handled by CSS in custom.css Section 8).

  2. Bare YouTube iframes: wraps unwrapped YouTube <iframe> elements in
     <div class="iframe-container"> and removes hardcoded width/height
     attributes so they scale responsively via CSS.

     Non-YouTube iframes (e.g., p5.js embeds) are left untouched since they
     may have intentionally different sizing or aspect ratios.

Usage:
    python scripts/fix_embedded_media.py          # dry run (default)
    python scripts/fix_embedded_media.py --run     # apply changes

Always run dry first and inspect with `git diff` after applying.
"""

import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

DOCS_DIR = "."  # Path to markdown files, relative to repo root

# ---------------------------------------------------------------------------
# Patterns
# ---------------------------------------------------------------------------

# Matches style="margin:0px" (with optional spaces/semicolons) on <video> tags.
VIDEO_STYLE_RE = re.compile(
    r'(<video\b[^>]*?)\s+style="margin:\s*0(?:px)?;?"',
    re.IGNORECASE,
)

# Matches a YouTube iframe on its own line, capturing leading whitespace.
YOUTUBE_IFRAME_RE = re.compile(
    r'^(?P<indent>[ \t]*)'                   # leading whitespace
    r'(?P<iframe><iframe\b[^>]*?'            # opening <iframe with attributes
    r'(?:youtube\.com|youtu\.be)[^>]*?'       # must be a YouTube URL
    r'>[^<]*</iframe>)',                       # close tag
    re.MULTILINE | re.IGNORECASE,
)

# Attributes to strip from iframes once inside the responsive container.
WIDTH_ATTR_RE = re.compile(r'\s+width="[^"]*"', re.IGNORECASE)
HEIGHT_ATTR_RE = re.compile(r'\s+height="[^"]*"', re.IGNORECASE)

# ---------------------------------------------------------------------------
# Fix functions
# ---------------------------------------------------------------------------

def fix_video_inline_styles(content: str) -> tuple[str, int]:
    """Remove redundant style="margin:0px" from <video> tags.

    Returns:
        (new_content, count_of_replacements)
    """
    return VIDEO_STYLE_RE.subn(r'\1', content)


def fix_youtube_iframes(content: str) -> tuple[str, int]:
    """Wrap bare YouTube iframes in <div class="iframe-container"> and strip
    hardcoded width/height.

    Iframes already inside an iframe-container div are skipped.
    Non-YouTube iframes are left untouched.

    Returns:
        (new_content, count_of_wraps)
    """
    count = 0
    lines = content.split('\n')
    result = []

    for i, line in enumerate(lines):
        m = YOUTUBE_IFRAME_RE.match(line)
        if not m:
            result.append(line)
            continue

        # Check if the previous non-empty line already has iframe-container
        already_wrapped = False
        for j in range(i - 1, max(i - 3, -1), -1):
            prev = lines[j].strip()
            if prev:
                already_wrapped = 'iframe-container' in prev
                break

        if already_wrapped:
            result.append(line)
            continue

        # Strip width/height attributes from the iframe
        indent = m.group('indent')
        iframe = m.group('iframe')
        iframe = WIDTH_ATTR_RE.sub('', iframe)
        iframe = HEIGHT_ATTR_RE.sub('', iframe)

        result.append(f'{indent}<div class="iframe-container">')
        result.append(f'{indent}  {iframe}')
        result.append(f'{indent}</div>')
        count += 1

    return '\n'.join(result), count

# ---------------------------------------------------------------------------
# File processing
# ---------------------------------------------------------------------------

def process_files(dry_run=True):
    """Scan markdown files and fix embedded media issues.

    Args:
        dry_run: If True, only print what would change without modifying files.

    Returns:
        Dict with summary stats.
    """
    stats = {
        "scanned": 0,
        "video_style_files": 0,
        "video_style_total": 0,
        "iframe_files": 0,
        "iframe_total": 0,
    }

    for filepath in sorted(Path(DOCS_DIR).rglob('*.md')):
        stats["scanned"] += 1
        content = filepath.read_text(encoding='utf-8')

        content, video_fixes = fix_video_inline_styles(content)
        content, iframe_fixes = fix_youtube_iframes(content)

        if video_fixes == 0 and iframe_fixes == 0:
            continue

        # Report what was found
        tag = "[DRY RUN] " if dry_run else "[UPDATED] "
        parts = []
        if video_fixes:
            parts.append(f"{video_fixes} video style(s)")
            stats["video_style_files"] += 1
            stats["video_style_total"] += video_fixes
        if iframe_fixes:
            parts.append(f"{iframe_fixes} bare iframe(s)")
            stats["iframe_files"] += 1
            stats["iframe_total"] += iframe_fixes

        print(f"  {tag}{filepath} — {', '.join(parts)}")

        if not dry_run:
            filepath.write_text(content, encoding='utf-8')

    return stats


def print_summary(stats, dry_run):
    """Print a summary of what was (or would be) changed."""
    mode = "DRY RUN" if dry_run else "COMPLETE"
    print(f"\n{'=' * 60}")
    print(f"  {mode} SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Files scanned:              {stats['scanned']}")
    print(f"  Issue 1 — video styles:     {stats['video_style_total']}"
          f" across {stats['video_style_files']} file(s)")
    print(f"  Issue 2 — bare iframes:     {stats['iframe_total']}"
          f" across {stats['iframe_files']} file(s)")
    print(f"{'=' * 60}")
    if dry_run and (stats['video_style_total'] + stats['iframe_total']) > 0:
        print("  Re-run with --run to apply changes.")


if __name__ == '__main__':
    dry_run = "--run" not in sys.argv
    stats = process_files(dry_run=dry_run)
    print_summary(stats, dry_run)
