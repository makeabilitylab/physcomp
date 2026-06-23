"""
check_a11y.py — CI gate for source-level media accessibility conventions.

Complements html-proofer (the Content lint "link-check" job). html-proofer
validates the BUILT site (broken links/anchors, missing-alt, HTML validity) but
deliberately does NOT enforce the authoring conventions below: it permits empty
`alt=""` (spec-correct "decorative" default, `ignore_empty_alt: true`) and has no
concept of iframe titles or video aria-labels. This script gates those three
markdown-SOURCE conventions, scanning published .md pages only (so it never
false-positives on theme/decorative images). It is the a11y analogue of
check_seo_frontmatter.py: a small policy check for conventions that have no
off-the-shelf equivalent.

Scans published .md pages for three common, mechanically-detectable a11y gaps:

  1. YouTube <iframe> without a `title=` attribute (screen readers announce a
     generic "iframe" with no context).
  2. <video> without an `aria-label` attribute (same problem for video heroes).
  3. Markdown images with empty or missing alt text — `![](...)` — on a
     published page.

Detection is intentionally conservative (only the patterns above, only on
published pages) so it can run as a non-flaky CI gate alongside
check_seo_frontmatter.py. Drafts (`nav_exclude`/`search_exclude`) and
contributor/deprecated docs are exempt, mirroring the SEO gate.

Modes:
    python scripts/check_a11y.py            # full report, grouped by module (exit 0)
    python scripts/check_a11y.py --summary  # per-module counts only
    python scripts/check_a11y.py --ci       # exit 1 if any issue found (CI gate)

Prints ASCII only (avoids cp1252 crashes in CI logs / Windows consoles).
"""

import re
import sys
from collections import defaultdict
from pathlib import Path

DOCS_DIR = "."
SKIP_DIRS = {"_site", ".git", "node_modules", "vendor", ".jekyll-cache",
             "scripts", "_includes", "_layouts", "_data", "_sass", "assets"}

# Pages exempt from the a11y requirement (contributor docs, deprecated).
IGNORE = {
    "website-dev.md", "website-install.md", "teaching-notes.md",
    "website-content-ideas.md", "README.md", "LICENSE.md", "CLAUDE.md",
    "404.md", "arduino/potentiometers-old.md",
}

FRONT_MATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)

# A full <iframe ...> ... </iframe> (or self-contained opening tag) — captured so
# we can test individual attributes. Non-greedy up to the first '>'.
IFRAME_OPEN_RE = re.compile(r"<iframe\b[^>]*>", re.IGNORECASE)
VIDEO_OPEN_RE = re.compile(r"<video\b[^>]*>", re.IGNORECASE)

YOUTUBE_RE = re.compile(r"youtube\.com|youtu\.be", re.IGNORECASE)
TITLE_ATTR_RE = re.compile(r'\btitle\s*=\s*"[^"]*"', re.IGNORECASE)
ARIA_LABEL_RE = re.compile(r'\baria-label\s*=\s*"[^"]*"', re.IGNORECASE)

# Markdown image with empty alt: ![](...) — allow whitespace inside the brackets.
EMPTY_ALT_RE = re.compile(r"!\[\s*\]\(")


def front_matter(content):
    m = FRONT_MATTER_RE.match(content)
    return (m.group(1), content[m.end():]) if m else (None, content)


def fm_true(fm, key):
    return bool(re.search(rf"^{key}:\s*true\s*$", fm, re.MULTILINE | re.IGNORECASE))


def line_of(body, idx):
    """1-based line number of character offset idx within body."""
    return body.count("\n", 0, idx) + 1


def scan_body(body):
    """Return a list of (line_no, kind, snippet) issues for one page body."""
    visible = HTML_COMMENT_RE.sub(lambda m: "\n" * m.group(0).count("\n"), body)
    issues = []

    for m in IFRAME_OPEN_RE.finditer(visible):
        tag = m.group(0)
        if YOUTUBE_RE.search(tag) and not TITLE_ATTR_RE.search(tag):
            issues.append((line_of(visible, m.start()), "iframe-no-title",
                           tag[:80]))

    for m in VIDEO_OPEN_RE.finditer(visible):
        tag = m.group(0)
        if not ARIA_LABEL_RE.search(tag):
            issues.append((line_of(visible, m.start()), "video-no-aria-label",
                           tag[:80]))

    for m in EMPTY_ALT_RE.finditer(visible):
        issues.append((line_of(visible, m.start()), "empty-alt",
                       visible[m.start():m.start() + 80].replace("\n", " ")))

    return sorted(issues)


def rel(p):
    return str(p).replace("\\", "/").lstrip("./")


def module_of(relpath):
    return relpath.split("/")[0] if "/" in relpath else "(root)"


def collect():
    """Return {relpath: [issues]} for all published pages with issues."""
    results = {}
    checked = 0
    for path in sorted(Path(DOCS_DIR).rglob("*.md")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        relpath = rel(path)
        if relpath in IGNORE:
            continue
        fm, body = front_matter(path.read_text(encoding="utf-8"))
        if fm is None or not re.search(r"^layout:", fm, re.MULTILINE):
            continue
        if fm_true(fm, "nav_exclude") or fm_true(fm, "search_exclude"):
            continue
        checked += 1
        issues = scan_body(body)
        if issues:
            results[relpath] = issues
    return results, checked


KINDS = ("iframe-no-title", "video-no-aria-label", "empty-alt")


def main():
    summary_only = "--summary" in sys.argv
    ci = "--ci" in sys.argv

    results, checked = collect()
    total = sum(len(v) for v in results.values())

    # Per-module tallies.
    by_module = defaultdict(lambda: defaultdict(int))
    for relpath, issues in results.items():
        mod = module_of(relpath)
        for _, kind, _ in issues:
            by_module[mod][kind] += 1

    print(f"Checked {checked} published page(s); "
          f"{total} a11y issue(s) in {len(results)} file(s).\n")

    print(f"{'module':<16}{'iframe':>9}{'video':>9}{'alt':>9}{'total':>9}")
    print("-" * 52)
    for mod in sorted(by_module, key=lambda m: -sum(by_module[m].values())):
        c = by_module[mod]
        tot = sum(c.values())
        print(f"{mod:<16}{c['iframe-no-title']:>9}"
              f"{c['video-no-aria-label']:>9}{c['empty-alt']:>9}{tot:>9}")
    print("-" * 52)
    gt = {k: sum(by_module[m][k] for m in by_module) for k in KINDS}
    print(f"{'TOTAL':<16}{gt['iframe-no-title']:>9}"
          f"{gt['video-no-aria-label']:>9}{gt['empty-alt']:>9}{total:>9}")

    if not summary_only:
        print()
        for relpath in sorted(results, key=lambda p: (module_of(p), p)):
            print(f"\n{relpath}")
            for line_no, kind, snippet in results[relpath]:
                print(f"  L{line_no:<5} {kind:<20} {snippet}")

    if ci and total:
        print(f"\nERROR: {total} accessibility issue(s) found on published pages.")
        print("Add title= to YouTube iframes, aria-label to <video>, and "
              "descriptive alt text to images.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
