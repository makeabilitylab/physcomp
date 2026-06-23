# Maintenance scripts

Python utilities that bulk-edit or generate content across the textbook. They are
**developer tools**, not part of the Jekyll build — nothing here runs during
`jekyll build` or the GitHub Actions deploy.

> [!IMPORTANT]
> **Keep this README in sync.** Whenever you add, remove, rename, or
> meaningfully change a script in this folder, update the table and the relevant
> section below in the same commit.

## Conventions

- **Dry run by default.** Every script previews its changes and writes nothing
  until you pass its apply flag (`--run` or `--apply`). Always dry-run first,
  apply, then inspect `git diff` before committing.
- **Run from the repo root** (where the `Gemfile` lives), e.g.
  `python scripts/fix_embedded_media.py`.
- Scripts target the Markdown lesson pages (and their `assets/`) in place.

## Scripts at a glance

| Script | Purpose | Apply flag |
|---|---|---|
| [`check_seo_frontmatter.py`](check_seo_frontmatter.py) | **CI gate** — fail if any published page is missing `description:` front matter (reminds about MP4-hero pages lacking a poster). Read-only. | _(none)_ |
| [`generate_og_posters.py`](generate_og_posters.py) | Generate static OG/social-card poster images from a page's hero `<video>` (MP4) via ffmpeg, and set `image:` front matter. | `--run` |
| [`fix_embedded_media.py`](fix_embedded_media.py) | Normalize `<video>` inline styles and wrap bare YouTube iframes responsively. | `--run` |
| [`update_lesson_nav.py`](update_lesson_nav.py) | Migrate old `.btn` lesson nav to card-style `<nav class="lesson-nav">` (rewrites `.md`→`.html`). | `--run` |
| [`fix_arduino_urls.py`](fix_arduino_urls.py) | Migrate old `arduino.cc` URLs to `docs.arduino.cc`. **Untested/brittle — use with care.** | `--apply` |
| [`check_a11y.py`](check_a11y.py) | **Deprecated** local-only a11y spot-check (iframe `title`, video `aria-label`, image alt). **Not a CI gate** — superseded by html-proofer. Read-only. | _(none)_ |

## Details

### `check_seo_frontmatter.py`

Enforces the per-page SEO convention: every published page must set `description:`.
Run by the **Content lint** GitHub Actions workflow (`.github/workflows/content-lint.yml`)
on every pull request — it exits non-zero (failing the PR check, but never the deploy) if
any page is missing it. Pages marked `nav_exclude: true`/`search_exclude: true`, plus the
contributor docs and deprecated pages, are exempt. `image:` is advisory: the script only
prints a reminder when an MP4-hero page has no poster yet. Read-only; takes no flags.

```bash
python scripts/check_seo_frontmatter.py    # exit 0 = all good, 1 = a page is missing description:
```

### `generate_og_posters.py`

For pages whose **first/hero media is an MP4 `<video>`**, extracts a representative
still (ffmpeg's `thumbnail` filter — more robust than the literal first frame) into
`<module>/assets/og/<lesson>.jpg` and sets/replaces the page's `image:` front
matter. Posters are **committed assets**; the build just copies them, so build time
is unaffected. Re-runs skip posters already newer than their source video.

Requires `ffmpeg` on PATH (tested with ffmpeg 6.0). See the "SEO and social cards"
section of [`website-dev.md`](../website-dev.md) for the overall convention.

```bash
python scripts/generate_og_posters.py                 # dry run, whole site
python scripts/generate_og_posters.py --run            # apply, whole site
python scripts/generate_og_posters.py --run --force    # re-encode even fresh posters
python scripts/generate_og_posters.py --run arduino/serial-print.md   # limit to files
```

### `fix_embedded_media.py`

Scans all `.md` files for two issues: (1) strips redundant `style="margin:0px"`
from `<video>` elements (handled by CSS in `custom.css` Section 8), and (2) wraps
unwrapped YouTube `<iframe>`s in `<div class="iframe-container">` and removes
hardcoded width/height so they scale responsively. Non-YouTube iframes (e.g. p5.js
embeds) are left untouched.

```bash
python scripts/fix_embedded_media.py          # dry run
python scripts/fix_embedded_media.py --run     # apply
```

### `update_lesson_nav.py`

Migrates the old `<span class="fs-6">…{: .btn .btn-outline }…</span>` lesson nav
to the card-style `<nav class="lesson-nav">`, converting link extensions from
`.md` to `.html`. Handles prev+next, next-only, and prev-only.

> Known gaps: does not match the single "Back to" button form, and its summary
> print can crash on Windows cp1252 consoles. Some pages may need hand-migration.

```bash
python scripts/update_lesson_nav.py           # dry run
python scripts/update_lesson_nav.py --run      # apply
```

### `check_a11y.py` (deprecated)

A fast, dependency-free local spot-check for three source-level a11y patterns:
YouTube `<iframe>`s missing `title=`, `<video>`s missing `aria-label`, and images
with empty alt (`![](...)`). Same published-page scope and draft/contributor
exemptions as `check_seo_frontmatter.py`.

> **Not a CI gate.** Content QA is moving to the off-the-shelf, Jekyll-native
> [`html-proofer`](https://github.com/gjtorikian/html-proofer) gem (checks missing
> image alt, broken links, and malformed HTML against the built `_site/`, with no
> new toolchain). Do **not** wire this script into `content-lint.yml`; once
> html-proofer is in place it can be deleted (see issue #110).

```bash
python scripts/check_a11y.py            # full report, grouped by module
python scripts/check_a11y.py --summary  # per-module counts only
python scripts/check_a11y.py --ci       # exit 1 if any issue (local spot-check)
```

### `fix_arduino_urls.py`

Sweeps `.md` files for old `arduino.cc` URLs and migrates them to `docs.arduino.cc`
(reference URLs with camelCase slug fixes, plus wiki-style URLs).

> **Untested and brittle** per its own header — it does not fully parse Markdown
> links. Review diffs carefully; prefer `--verify` to HTTP-check the new URLs.

```bash
python scripts/fix_arduino_urls.py            # dry run
python scripts/fix_arduino_urls.py --apply     # apply
python scripts/fix_arduino_urls.py --verify    # dry run + HTTP-check new URLs
python scripts/fix_arduino_urls.py --apply --verify
```
