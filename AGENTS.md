# AGENT HANDBOOK FOR KEVYDER.DEV

This document orients autonomous coding agents working in `kevyder.dev`. Follow it to keep builds reproducible, styles consistent, and deploys safe.

## STACK SNAPSHOT
- Static site powered by Jekyll 4.4.1, Ruby 2.5+.
- Styling through Sass partials in `_sass/` compiled via Jekyll pipeline.
- Single vanilla JS entrypoint at `assets/js/app.js` for navigation behavior.
- Content authored in Markdown with Liquid front matter; projects live in `_projects/*.markdown`.
- Generated output `_site/` stays untracked; never edit files there.

## TOOLING & ENVIRONMENT
- Ruby: prefer the system Ruby or asdf; ensure Bundler is available (`gem install bundler` if missing).
- Dependencies: `bundle install` from repo root; lockfile `Gemfile.lock` is authoritative.
- Node/Sass tooling is handled by Jekyll; no separate npm install is needed.
- Secrets: none checked in; respect `.env` patterns if introduced later.
- No Cursor or Copilot rule files currently exist, so this handbook is the active source of guidance.

## RUN COMMANDS
```
bundle install                               # install gems
bundle exec jekyll serve                     # dev server at http://localhost:4000 with live reload
bundle exec jekyll serve --livereload        # explicit livereload switch if default disabled
bundle exec jekyll serve --drafts            # include drafts (none yet) when previewing content
bundle exec jekyll serve --config _config.yml,_config_dev.yml  # layered config if temp flags are needed
bundle exec jekyll build                     # production build into _site/
bundle exec jekyll build --trace             # verbose build for debugging a single failing page
bundle exec jekyll build --incremental       # faster rebuilds; use only for local debug
rm -rf _site .jekyll-cache                   # clean workspace when odd caching bugs appear
```

### Running a "Single Test"
- There is no automated test suite. Simulate a focused check by building only the page you touched:
  - Use `bundle exec jekyll build --trace` and verify the specific permalink in `_site/`.
  - For Markdown/Liquid errors the trace will point at the exact file and line.
- Optional HTML proofing: `bundle exec htmlproofer ./_site --file-ignore "/resume/"` (install gem if needed) to lint links/headings.

## DEV WORKFLOW BASICS
- Start `bundle exec jekyll serve` before editing; it rebuilds on file save.
- Keep front matter YAML valid; malformed YAML crashes the server before rendering content.
- When altering `_config.yml`, restart the server; that file is not hot-reloaded.
- Avoid editing `_site/`; modify source files and let Jekyll regenerate output.
- Track any new assets/fonts so `styles.scss` can import them (Jekyll watches `_sass` + `assets/css`).

## LAYOUT & LIQUID STYLE
- Follow the existing includes-first pattern: `_layouts/home.html` composes `_includes/head.html`, `header.html`, `main-section.html`.
- Keep HTML5 semantic tags (`<header>`, `<nav>`, `<div class="main">`).
- Liquid tags: prefer `{% include %}` for shared markup and `{{ site.* }}` for metadata.
- Maintain sorted collections: `projects.html` sorts by custom `order`; preserve or extend that pattern with `assign` then `for` loops.
- Use descriptive front matter fields (`title`, `description`, `stack`, `source`, `order`). Add new keys only when templates consume them.
- Comments: prefer HTML comments for snippets that render, Liquid comments `{% comment %}` for template logic.

## CONTENT & MARKDOWN
- Front matter always starts and ends with `---` and includes `layout`.
- Use multiline YAML for paragraphs (see `index.markdown:description`); indent HTML spans within YAML strings exactly two spaces.
- Markdown files may embed inline HTML (e.g., `<span class="accentuated">`). Ensure tags match CSS selectors.
- Keep tone conversational, first-person for bio sections unless adding third-party testimonials.
- Update `_projects` entries with succinct descriptions and stacks; keep `order` unique integers to control display order.

## SASS & STYLING GUIDELINES
- Root stylesheet `assets/css/styles.scss` only defines resets + `@font-face` + `@import "app"`; keep it minimal.
- Modularize styles inside `_sass/*.scss`; ensure `app.scss` imports new partials explicitly.
- Variables: define shared tokens (`$dark-turquoise`, `$gray-text`) near top of each partial or move to a dedicated `_sass/_tokens.scss` before wide reuse.
- Nest selectors conservatively (two to three levels). Use `&::before` / `&:hover` for pseudo selectors.
- Media queries: follow current breakpoint `@media (max-width: 768px)`; keep responsive adjustments next to base styles.
- Typography: custom `superhelio` font is primary; keep fallbacks `sans-serif` in font-family stacks.
- Animations: namespace keyframes inside component scopes (see `.main @keyframes cursor-blink`).
- Do not rely on global IDs except existing `#project-wrapper`; prefer class selectors.

## JAVASCRIPT STYLE
- Only script lives in `assets/js/app.js`; keep future scripts modular but small enough for the same bundle.
- Vanilla JS only. Avoid frameworks unless repo owner adds a build step.
- Wrap logic in `DOMContentLoaded` listener to ensure DOM availability.
- Query elements with `document.querySelector` / `querySelectorAll` once, reuse references.
- Toggle CSS classes for state; never manipulate inline styles except for body overflow lock (existing pattern).
- Keep listeners arrow-function based; respect early return guards before touching DOM nodes.
- If adding utilities, comment blocks describing user-interaction side effects (e.g., scroll locking) but skip obvious comments.

## ASSETS, FONTS, AND MEDIA
- Static assets reside under `assets/`, `fonts/`, and `icons/`. Reference them with absolute paths from site root.
- When adding fonts, extend `@font-face` blocks in `styles.scss`; ensure files exist in `/fonts` and use `font-display: swap`.
- Optimize images (SVG/PNG) before committing. Provide 1x/2x icons when linking in `_includes/head.html`.
- Maintain canonical links and meta tags inside the `head` include for SEO.

## ACCESSIBILITY & SEO
- Preserve `lang="en"` and `dir="ltr"` on `<html>`.
- Navigation buttons must remain keyboard accessible; toggling classes should not trap focus.
- Maintain `text-decoration` for links, using color + underline for hover clarity.
- Provide descriptive meta descriptions and social card tags via `_includes/head.html` when content changes.
- When adding sections, ensure heading hierarchy remains logical (`h1` in header, `h2` for subsections, `h3` for project cards).

## ERROR HANDLING & DEBUGGING
- Build failures typically surface as Liquid errors. Read the stack trace Jekyll prints; it points to filename and line.
- For JavaScript, open browser console; code is simple enough that syntax errors block execution immediately.
- CSS issues: rely on browser devtools; remember Sass compiles to minified CSS (compressed), so inspect source SCSS for edits.
- If a new gem is required, add a pinned version to `Gemfile` and run `bundle lock --update <gem>` to refresh the lockfile.

## QUALITY ASSURANCE
- Manual smoke test after changes:
  1. `bundle exec jekyll build --trace`
  2. Open `_site/index.html` in a browser; ensure nav toggle, accentuated text cursor, and project links function.
  3. Check responsive layout via devtools, focusing on the 768px breakpoint.
- Optional link linting via `htmlproofer` as noted above; treat warnings as actionable.
- No automated CI currently; document any manual checks you performed in PR descriptions.

## GIT & COLLABORATION
- Do not commit `_site/`, `.jekyll-cache/`, or OS artifacts.
- Branch naming suggestion: `feature/<topic>` or `fix/<bug>`.
- Keep commits focused; describe intent ("clarify nav typography" > "updates").
- Never rewrite user commits without explicit instruction. Avoid `rebase -i` in automated contexts.
- Before committing, run `git status` to confirm only relevant files are staged; agents must not revert user work.

## AGENT ETIQUETTE
- Read surrounding context before editing; preserve tone and structure.
- Prefer `apply_patch` for single-file tweaks; if mass updates are needed, explain the strategy first.
- Keep responses concise but include file references (e.g., `assets/js/app.js:12`).
- When information is missing, propose a default and state assumptions rather than blocking.
- Document any manual verification you skipped so humans can follow up.

## EXTENDING THE SITE
- New sections belong in `_includes/` and imported via `_layouts/home.html` to keep structure tidy.
- Additional collections can be defined in `_config.yml`; mirror the existing `projects` pattern.
- For blog-like content, add Markdown files under `_posts/` (directory not yet created) with standard naming `YYYY-MM-DD-title.md`.
- When integrating third-party scripts (analytics, embeds), add them near the existing Google tag to keep `head.html` organized.

## WHAT'S MISSING & FUTURE WORK
- No linting pipeline exists; if you add one (e.g., `stylelint` or `prettier`), document commands here.
- Consider adding basic CI (GitHub Actions with `bundle exec jekyll build`). Update this file if that happens.
- Assets could benefit from additional color tokens or dark/light themes; ensure any new design system is recorded in the Sass section.

## CONTACT & OWNERSHIP
- Primary maintainer: Kevin Rodríguez (`@kevyder`).
- Raise issues via GitHub repo; avoid emailing unless absolutely necessary.
- When you finish a task, summarize what changed, how you verified it, and suggest logical next steps if any remain.

## REFERENCES & QUICK LINKS
- Docs: https://jekyllrb.com/docs/ for core behavior; https://sass-lang.com/documentation/ for syntax clarifications.
- Icons: regenerate via https://realfavicongenerator.net/ and replace files under `icons/`.
- Fonts: custom `superhelio` lives in `/fonts`; keep backups before swapping.
- Analytics: Google tag inserted in `_layouts/home.html`; coordinate changes with maintainer.
- Hosting: site deploys via GitHub Pages; production build mirrors `bundle exec jekyll build`.
- Accessibility checklist: https://www.a11yproject.com/checklist/ is the reference when adding UI.
- Markdown cheatsheet: https://www.markdownguide.org/basic-syntax/ for quick formatting.
- Liquid reference: https://shopify.github.io/liquid/filters/ for filter behavior.
- HTML proofing gem: https://github.com/gjtorikian/html-proofer for optional linting.
- Image compression: use `squoosh.app`; keep WebP + PNG when appropriate.

_Last updated by OpenCode agent._
