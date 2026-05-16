"""
update_lesson_nav.py — Migrate lesson navigation buttons to card-style <nav>.

Scans all .md files under DOCS_DIR for the old-style lesson nav pattern:

    <span class="fs-6">
    [Previous: ...](file.md){: .btn .btn-outline }
    [Next: ...](file.md){: .btn .btn-outline }
    </span>

and replaces it with the new card-style navigation:

    <nav class="lesson-nav" aria-label="Lesson navigation">
      <a href="file.html">
        <div class="nav-label">&larr; Previous Lesson</div>
        <div class="nav-title">Title</div>
      </a>
      ...
    </nav>

Handles three cases: prev+next, next-only, and prev-only.
Link extensions are converted from .md to .html for Jekyll compatibility.

Usage:
    python scripts/update_lesson_nav.py          # dry run (default)
    python scripts/update_lesson_nav.py --run     # apply changes

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

# Matches the entire <span class="fs-6">...</span> nav block
BLOCK_RE = re.compile(
    r'<span class="fs-6">\s*\n(.*?)</span>',
    re.DOTALL
)

# Matches a "Previous" link, with or without leading arrow characters
PREV_RE = re.compile(
    r'\[(?:← |&larr; )?Previous:\s*(.*?)\]\((.*?)\.md\)',
    re.IGNORECASE
)

# Matches a "Next" link, with or without trailing arrow characters
NEXT_RE = re.compile(
    r'\[Next:\s*(.*?)(?: →| &rarr;)?\]\((.*?)\.md\)',
    re.IGNORECASE
)

# ---------------------------------------------------------------------------
# HTML generation
# ---------------------------------------------------------------------------

def build_nav(prev, next_):
    """Build the new <nav> HTML from extracted link data.

    Args:
        prev: Tuple of (title, href_without_extension) or None.
        next_: Tuple of (title, href_without_extension) or None.

    Returns:
        HTML string for the new lesson nav block.
    """
    links = []
    if prev:
        links.append(
            f'  <a href="{prev[1]}.html">\n'
            f'    <div class="nav-label">&larr; Previous Lesson</div>\n'
            f'    <div class="nav-title">{prev[0]}</div>\n'
            f'  </a>'
        )
    if next_:
        links.append(
            f'  <a href="{next_[1]}.html">\n'
            f'    <div class="nav-label">Next Lesson &rarr;</div>\n'
            f'    <div class="nav-title">{next_[0]}</div>\n'
            f'  </a>'
        )
    return (
        '<nav class="lesson-nav" aria-label="Lesson navigation">\n'
        + '\n'.join(links)
        + '\n</nav>'
    )

# ---------------------------------------------------------------------------
# File processing
# ---------------------------------------------------------------------------

def process_files(dry_run=True):
    """Scan markdown files and replace old nav blocks with new card-style nav.

    Args:
        dry_run: If True, only print what would change without modifying files.

    Returns:
        Dict with summary stats.
    """
    stats = {
        "scanned": 0,
        "updated": 0,
        "skipped_no_block": 0,
        "skipped_no_links": 0,
        "prev_next": 0,
        "next_only": 0,
        "prev_only": 0,
    }

    for filepath in sorted(Path(DOCS_DIR).rglob('*.md')):
        stats["scanned"] += 1
        content = filepath.read_text(encoding='utf-8')

        # Look for the old <span class="fs-6"> nav block
        block = BLOCK_RE.search(content)
        if not block:
            stats["skipped_no_block"] += 1
            continue

        # Extract Previous and Next links from inside the block
        inner = block.group(1)
        prev = PREV_RE.search(inner)
        next_ = NEXT_RE.search(inner)

        if not prev and not next_:
            stats["skipped_no_links"] += 1
            continue

        # Determine nav type for reporting
        if prev and next_:
            nav_type = "prev+next"
            stats["prev_next"] += 1
        elif next_:
            nav_type = "next only"
            stats["next_only"] += 1
        else:
            nav_type = "prev only"
            stats["prev_only"] += 1

        # Build replacement HTML
        prev_data = (prev.group(1).strip(), prev.group(2)) if prev else None
        next_data = (next_.group(1).strip(), next_.group(2)) if next_ else None
        new_nav = build_nav(prev_data, next_data)

        # Replace the old block with the new nav
        new_content = content[:block.start()] + new_nav + content[block.end():]

        tag = "[DRY RUN] " if dry_run else "[UPDATED] "
        print(f"  {tag}{filepath} ({nav_type})")

        if not dry_run:
            filepath.write_text(new_content, encoding='utf-8')

        stats["updated"] += 1

    return stats


def print_summary(stats, dry_run):
    """Print a summary of what was (or would be) changed."""
    mode = "DRY RUN" if dry_run else "COMPLETE"
    print(f"\n{'=' * 50}")
    print(f"  {mode} SUMMARY")
    print(f"{'=' * 50}")
    print(f"  Files scanned:        {stats['scanned']}")
    print(f"  Files updated:        {stats['updated']}")
    print(f"    ├─ prev + next:     {stats['prev_next']}")
    print(f"    ├─ next only:       {stats['next_only']}")
    print(f"    └─ prev only:       {stats['prev_only']}")
    print(f"  Skipped (no block):   {stats['skipped_no_block']}")
    print(f"  Skipped (no links):   {stats['skipped_no_links']}")
    print(f"{'=' * 50}")
    if dry_run:
        print("  Re-run with --run to apply changes.")


if __name__ == '__main__':
    dry_run = "--run" not in sys.argv
    stats = process_files(dry_run=dry_run)
    print_summary(stats, dry_run)
