# AGENTS.md

## Stack

- Jekyll 4.4.1 (pinned in `Gemfile`), Sass compiled by Jekyll (`style: compressed`), single vanilla JS file.
- **No test suite, no CI, no lint config, no Node.**

## Commands

```bash
bundle install                          # install gems
bundle exec jekyll serve                # dev server http://localhost:4000
bundle exec jekyll build --trace        # production build, verbose errors
```

Optional link lint (not in Gemfile):
```bash
gem install html-proofer && bundle exec htmlproofer ./_site --file-ignore "/resume/"
```

## Verification

No automated tests. Verify by building and inspecting `_site/` output.

## Gotchas

- `_config.yml` not hot-reloaded — restart `jekyll serve` after changes.
- Never edit `_site/` — generated output, gitignored.
- CSS output is compressed — inspect source SCSS in `_sass/`, not browser output.
- New `_sass/*.scss` partial won't compile until imported in `_sass/app.scss`.

## Conventions

- **Projects**: new `_projects/*.markdown` must include unique integer `order` in front matter — `_includes/projects.html` sorts by `order`.
- **Sass entry chain**: `assets/css/styles.scss` → `@import "app"` → `_sass/app.scss` imports partials (`header`, `main-section`).
- **JS**: single entrypoint `assets/js/app.js`, vanilla only, no build step.
