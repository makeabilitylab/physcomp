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
| [`generate_og_posters.py`](generate_og_posters.py) | Generate static OG/social-card poster images from a page's hero `<video>` (MP4) via ffmpeg, and set `image:` front matter. | `--run` |
| [`fix_embedded_media.py`](fix_embedded_media.py) | Normalize `<video>` inline styles and wrap bare YouTube iframes responsively. | `--run` |
| [`update_lesson_nav.py`](update_lesson_nav.py) | Migrate old `.btn` lesson nav to card-style `<nav class="lesson-nav">` (rewrites `.md`→`.html`). | `--run` |
| [`fix_arduino_urls.py`](fix_arduino_urls.py) | Migrate old `arduino.cc` URLs to `docs.arduino.cc`. **Untested/brittle — use with care.** | `--apply` |

## Details

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
