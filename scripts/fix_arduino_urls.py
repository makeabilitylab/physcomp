#!/usr/bin/env python3
"""
WARNING: I HAVE NOT TESTED THIS YET. PLEASE BE CAREFUL!!!

AT THE VERY LEAST, THIS IMPLEMENTATION SEEMS BRITTLE AS IT DOESN'T ACTUALLY PARSE THE MARKDOWN FOR ALL LINKS
AND THEN TRY TO FIX THEM...

fix_arduino_urls.py — Sweep .md files for old arduino.cc URLs and migrate them
to the new docs.arduino.cc domain.

Two categories of fix:
  1. Reference URLs (www.arduino.cc/reference/en/...) → docs.arduino.cc/language-reference/en/...
     with camelCase slug corrections for the new case-sensitive domain.
  2. Wiki-style URLs (www.arduino.cc/en/...) → equivalent docs.arduino.cc page.

Usage:
    python fix_arduino_urls.py             (dry run — default, no files modified)
    python fix_arduino_urls.py --apply     (write changes to disk)
    python fix_arduino_urls.py --verify    (dry run + HTTP check every new URL)
    python fix_arduino_urls.py --apply --verify
"""

import re
import sys
import os
import time
from pathlib import Path
from typing import Optional
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError

# ── Slug casing corrections (old lowercase → new camelCase) ──────────────
SLUG_CASE_MAP = {
    "settimeout": "setTimeout",
    "readbytes": "readBytes",
    "readbytesuntil": "readBytesUntil",
    "readstring": "readString",
    "readstringuntil": "readStringUntil",
    "analogread": "analogRead",
    "analogwrite": "analogWrite",
    "digitalread": "digitalRead",
    "digitalwrite": "digitalWrite",
    "pinmode": "pinMode",
    "analogreadresolution": "analogReadResolution",
    "analogwriteresolution": "analogWriteResolution",
    "stringobject": "stringObject",
    "attachinterrupt": "attachInterrupt",
    "analogreference": "analogReference",
    "indexof": "indexOf",
}

# ── Full wiki-style URL replacements ─────────────────────────────────────
# Maps old path (case-insensitive match) → new full URL
WIKI_URL_MAP = {
    # Built-in examples
    "en/Tutorial/BuiltInExamples/Calibration": "https://docs.arduino.cc/built-in-examples/analog/Calibration/",
    "en/Tutorial/BuiltInExamples/ReadAnalogVoltage": "https://docs.arduino.cc/built-in-examples/analog/ReadAnalogVoltage/",
    "en/Tutorial/ReadAnalogVoltage": "https://docs.arduino.cc/built-in-examples/analog/ReadAnalogVoltage/",
    "en/Tutorial/BuiltInExamples/Smoothing": "https://docs.arduino.cc/built-in-examples/analog/Smoothing/",
    "en/Tutorial/BuiltInExamples/Graph": "https://docs.arduino.cc/built-in-examples/communication/Graph/",
    "en/Tutorial/BuiltInExamples/Debounce": "https://docs.arduino.cc/built-in-examples/digital/Debounce/",
    "en/Tutorial/BuiltInExamples/BlinkWithoutDelay": "https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/",
    "en/Tutorial/BlinkWithoutDelay": "https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/",
    "en/Tutorial/BuiltInExamples": "https://docs.arduino.cc/built-in-examples/",
    "en/tutorial/blink": "https://docs.arduino.cc/built-in-examples/digital/Blink/",
    "en/Tutorial/Blink": "https://docs.arduino.cc/built-in-examples/digital/Blink/",
    "en/Tutorial/InputPullupSerial": "https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/",
    "en/Tutorial/Knob": "https://docs.arduino.cc/library-examples/servo-library/Knob/",
    "en/Tutorial/SimpleAudioPlayer": "https://docs.arduino.cc/library-examples/audio-zero-library/SimpleAudioPlayer/",
    # Learn / foundations / guides
    "en/Tutorial/DigitalPins": "https://docs.arduino.cc/learn/microcontrollers/digital-pins/",
    "en/Tutorial/AnalogInputPins": "https://docs.arduino.cc/learn/microcontrollers/analog-input/",
    "en/Tutorial/PWM": "https://docs.arduino.cc/learn/microcontrollers/analog-output/",
    "en/Tutorial/Foundations": "https://docs.arduino.cc/learn/",
    "en/Tutorial/HomePage": "https://docs.arduino.cc/built-in-examples/",
    "en/guide/introduction": "https://docs.arduino.cc/learn/starting-guide/getting-started-arduino/",
    "en/guide/libraries": "https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries/",
    # Serial
    "en/Serial.Begin": "https://docs.arduino.cc/language-reference/en/functions/communication/serial/begin/",
    # Reference shortcuts
    "en/reference/board": "https://docs.arduino.cc/hardware/uno-rev3/",
    "en/reference/serial": "https://docs.arduino.cc/language-reference/en/functions/communication/serial/",
    "en/reference/servo": "https://docs.arduino.cc/libraries/servo/",
    "en/Reference/PortManipulation": "https://docs.arduino.cc/hacking/software/PortManipulation/",
    # Software download — these still work on www.arduino.cc
    "en/main/software": "https://www.arduino.cc/en/software/",
    # Product pages (keep on main domain)
    "en/Main/Arduino_BoardLeonardo": "https://docs.arduino.cc/hardware/leonardo/",
    # Float reference (pmwiki)
    "en/pmwiki.php?n=Reference/Float": "https://docs.arduino.cc/language-reference/en/variables/data-types/float/",
}


def fix_reference_url(url: str) -> str:
    """Fix a www.arduino.cc/reference/en/... URL → docs.arduino.cc/language-reference/en/..."""
    # Extract the path after the domain
    match = re.match(
        r'https?://(?:www\.)?arduino\.cc/reference/en/(.*)', url
    )
    if not match:
        return url

    path = match.group(1)

    # The old URL structure was: reference/en/language/functions/...
    # The new structure is:     language-reference/en/functions/...
    # So strip the leading "language/" if present — it's now encoded in the domain path.
    if path.startswith('language/'):
        path = path[len('language/'):]

    # Fix slug casing in the path
    parts = path.rstrip('/').split('/')
    fixed_parts = []
    for part in parts:
        lower = part.lower()
        if lower in SLUG_CASE_MAP:
            fixed_parts.append(SLUG_CASE_MAP[lower])
        else:
            fixed_parts.append(part)

    new_path = '/'.join(fixed_parts)
    # Preserve trailing slash if original had one
    if url.endswith('/'):
        new_path += '/'

    return f"https://docs.arduino.cc/language-reference/en/{new_path}"


def fix_wiki_url(url: str) -> Optional[str]:
    """Fix a www.arduino.cc/en/... wiki-style URL → docs.arduino.cc equivalent."""
    # Extract path after domain
    match = re.match(
        r'https?://(?:www\.)?arduino\.cc/(en/.*)', url
    )
    if not match:
        return None

    path = match.group(1).rstrip('/')

    # Try exact match first (case-insensitive keys)
    for old_path, new_url in WIKI_URL_MAP.items():
        if path.lower() == old_path.lower():
            return new_url
        # Also try with trailing slash stripped from both
        if path.lower().rstrip('/') == old_path.lower().rstrip('/'):
            return new_url

    return None


def is_inside_html_comment(line: str, match_start: int) -> bool:
    """Check if a position in a line is inside an HTML comment."""
    # Simple heuristic: check if there's an unclosed <!-- before the match
    before = line[:match_start]
    comment_opens = before.count('<!--')
    comment_closes = before.count('-->')
    return comment_opens > comment_closes


# Pattern to match Arduino URLs we care about
URL_PATTERN = re.compile(
    r'https?://(?:www\.)?arduino\.cc/(reference/en/|en/)[^\s)\]"\'><]*'
)


def process_file(filepath: Path, apply: bool = False) -> list[dict]:
    """Process a single .md file. Returns list of changes made."""
    changes = []

    with open(filepath, 'r', encoding='utf-8', newline='') as f:
        lines = f.readlines()

    new_lines = []
    for line_num, line in enumerate(lines, start=1):
        new_line = line

        # Skip lines that are entirely inside HTML comments
        # (rough check — full multi-line comment detection is harder,
        # but most comments in these files are single-line or the URL
        # line itself has the comment markers)
        stripped = line.strip()
        if stripped.startswith('<!--') and stripped.endswith('-->'):
            new_lines.append(line)
            continue
        # Also skip if it starts with <!-- (partial comment line — be cautious)
        if stripped.startswith('<!--') and '-->' not in stripped:
            new_lines.append(line)
            continue

        for match in URL_PATTERN.finditer(line):
            old_url = match.group(0)
            # Clean trailing punctuation that's not part of the URL
            while old_url and old_url[-1] in '.),;:':
                old_url = old_url[:-1]

            # Skip if already docs.arduino.cc
            if 'docs.arduino.cc' in old_url:
                continue
            # Skip github.com or create.arduino.cc (shouldn't match but safety)
            if 'github.com' in old_url or 'create.arduino.cc' in old_url:
                continue
            # Skip en/software — the download page still works on www.arduino.cc
            if re.search(r'arduino\.cc/en/software', old_url):
                continue

            # Check if inside HTML comment
            if is_inside_html_comment(line, match.start()):
                continue

            new_url = None
            fix_type = None

            if '/reference/en/' in old_url:
                new_url = fix_reference_url(old_url)
                fix_type = 'reference'
            elif re.search(r'arduino\.cc/en/', old_url):
                new_url = fix_wiki_url(old_url)
                fix_type = 'wiki'

            if new_url and new_url != old_url:
                new_line = new_line.replace(old_url, new_url)
                changes.append({
                    'line': line_num,
                    'old': old_url,
                    'new': new_url,
                    'type': fix_type,
                })
            elif new_url is None and fix_type == 'wiki':
                changes.append({
                    'line': line_num,
                    'old': old_url,
                    'new': '⚠️  NO MAPPING FOUND',
                    'type': 'unmapped',
                })

        new_lines.append(new_line)

    if apply and changes:
        # Only write if there are actual fixes (not just unmapped warnings)
        real_changes = [c for c in changes if c['type'] != 'unmapped']
        if real_changes:
            with open(filepath, 'w', encoding='utf-8', newline='') as f:
                f.writelines(new_lines)

    return changes


def verify_url(url: str) -> tuple[int, str]:
    """Send a HEAD request (falling back to GET) and return (status_code, reason).

    Returns (0, <error message>) on connection/timeout failures.
    Respects a 0.3 s delay between requests to avoid hammering the server.
    """
    headers = {
        'User-Agent': 'physcomp-link-checker/1.0 (educational site maintenance)',
    }
    for method in ('HEAD', 'GET'):
        try:
            req = Request(url, headers=headers, method=method)
            with urlopen(req, timeout=10) as resp:
                return (resp.status, resp.reason)
        except HTTPError as e:
            return (e.code, e.reason)
        except (URLError, TimeoutError, OSError) as e:
            if method == 'GET':
                return (0, str(e))
    return (0, 'unknown error')


def main():
    apply = '--apply' in sys.argv
    verify = '--verify' in sys.argv
    repo_root = Path(__file__).parent.parent

    # ── Banner ────────────────────────────────────────────────────────────
    mode = "APPLY MODE — files will be modified" if apply else "DRY RUN — no files will be modified"
    print(f"\n{'=' * 80}")
    print(f"  fix_arduino_urls.py")
    print(f"  Mode: {mode}")
    if verify:
        print(f"  Link verification: ON (will HTTP-check every new URL)")
    print(f"{'=' * 80}")

    # Directories to skip (already fixed)
    skip_dirs = {'_communication'}

    md_files = sorted(repo_root.rglob('*.md'))
    total_changes = 0
    total_unmapped = 0
    files_changed = 0

    # Collect unique new URLs for verification
    urls_to_verify: dict[str, list[str]] = {}  # url → [file:line, ...]

    for filepath in md_files:
        # Skip already-fixed communication module
        rel = filepath.relative_to(repo_root)
        if any(part in skip_dirs for part in rel.parts):
            continue

        changes = process_file(filepath, apply=apply)
        if not changes:
            continue

        real_changes = [c for c in changes if c['type'] != 'unmapped']
        unmapped = [c for c in changes if c['type'] == 'unmapped']

        if real_changes or unmapped:
            print(f"\n{'─' * 80}")
            print(f"📄 {rel}")
            print(f"{'─' * 80}")

        for c in real_changes:
            print(f"  L{c['line']:>4d}  {c['type']:>10s}")
            print(f"         OLD: {c['old']}")
            print(f"         NEW: {c['new']}")
            total_changes += 1

            if verify:
                loc = f"{rel}:{c['line']}"
                urls_to_verify.setdefault(c['new'], []).append(loc)

        for c in unmapped:
            print(f"  L{c['line']:>4d}  ⚠️  UNMAPPED wiki URL (needs manual review):")
            print(f"         {c['old']}")
            total_unmapped += 1

        if real_changes:
            files_changed += 1

    # ── Link verification ─────────────────────────────────────────────────
    broken_count = 0
    if verify and urls_to_verify:
        unique_urls = sorted(urls_to_verify.keys())
        print(f"\n{'=' * 80}")
        print(f"VERIFYING {len(unique_urls)} unique new URLs...")
        print(f"{'=' * 80}")

        # Probe one known-good URL to detect bot blocking (Cloudflare, etc.)
        probe_url = "https://docs.arduino.cc/language-reference/"
        probe_status, probe_reason = verify_url(probe_url)
        if probe_status == 403:
            print(f"\n  ⚠️  docs.arduino.cc returned 403 on a known-good URL.")
            print(f"     This site uses Cloudflare bot protection that blocks")
            print(f"     automated requests. HTTP verification won't work here.")
            print(f"\n     Exporting URL list for manual/browser verification instead...")

            urls_file = repo_root / 'scripts' / 'urls_to_verify.txt'
            with open(urls_file, 'w') as f:
                for url in unique_urls:
                    locs = ', '.join(urls_to_verify[url])
                    f.write(f"{url}  # {locs}\n")
            print(f"     Wrote {len(unique_urls)} URLs to: {urls_file.relative_to(repo_root)}")
            print(f"\n     To check these in a browser, you can run:")
            print(f"       xargs -I {{}} open {{}} < scripts/urls_to_verify.txt")
            print(f"     or use a link-checker that runs in a real browser (e.g. lychee --accept 403).")
        else:
            for i, url in enumerate(unique_urls, 1):
                status, reason = verify_url(url)
                if status == 200:
                    indicator = "✅"
                elif 300 <= status < 400:
                    indicator = "🔀"  # redirect (usually fine)
                else:
                    indicator = "❌"
                    broken_count += 1

                # Only print non-200 or if verbose
                if status != 200:
                    print(f"  {indicator} {status} {reason}")
                    print(f"       {url}")
                    for loc in urls_to_verify[url]:
                        print(f"         ↳ {loc}")
                else:
                    # Compact progress for 200s
                    print(f"  {indicator} {url}")

                time.sleep(0.3)  # rate limiting

            print(f"\n  Verified: {len(unique_urls)} URLs, "
                  f"{len(unique_urls) - broken_count} OK, {broken_count} broken")

    # ── Summary ───────────────────────────────────────────────────────────
    print(f"\n{'=' * 80}")
    print(f"SUMMARY")
    print(f"{'=' * 80}")
    print(f"  Files scanned:    {len(md_files)}")
    print(f"  Files changed:    {files_changed}")
    print(f"  URLs fixed:       {total_changes}")
    print(f"  Unmapped URLs:    {total_unmapped}")
    if verify:
        print(f"  Broken new URLs:  {broken_count}")
    if not apply:
        print(f"\n  ⚡ DRY RUN — no files modified. Use --apply to write changes.")
    else:
        print(f"\n  ✅ Changes written to disk.")
    if not verify:
        print(f"  💡 Tip: add --verify to HTTP-check all new URLs.")


if __name__ == '__main__':
    main()
