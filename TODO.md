# Task Parking Lot

- [ ] Export to PDF
- [ ] Standard Site integration?

## Content Model

- [x] Add `tags` frontmatter, plus `/tags/` and per-tag listing pages.
- [x] Add `tags?: string[]` to the Astro content schema.
- [x] Add true recent notes using git-derived dates.
- [x] Prefer git-derived dates for recent-note sorting.
- [ ] Show updated dates in note headers and listing pages.
- [ ] Add note maturity/status frontmatter such as seedling, growing, evergreen, or archived.
- [ ] Use note status in headers, listings, related notes, and search filters.
- [ ] Keep note status optional.
- [ ] Add private/draft filtering with explicit `draft: true` & `publish: false` frontmatter.
- [ ] Default notes to published unless they opt out.
- [ ] Exclude drafts from listings, backlinks, related notes, search, sitemap, and the content index.

## Folder Navigation

- [x] Add folder listing pages for every content folder.
- [x] Use `index.md`/`README.mdx` content as folder page intros when present.
- [x] List descendant notes on folder pages, not only direct children.
- [x] Sort folder listings with folders first, then notes by title.
- [x] Replace the flat sidebar groups with a server-rendered file tree/explorer.
- [x] Build the explorer tree from existing `pathForDoc` paths.
- [x] Use folder index titles as explorer folder labels when available.
- [x] Preserve active-link highlighting in the explorer.
- [ ] Collapsible explorer state only after the static tree works.

## Tags and Collections

- [x] Generate a tag index page.
- [x] Generate one listing page per tag.
- [ ] Consider hierarchical tags only after flat tags become useful.
- [ ] Add generated collection pages: maps of content, topic hubs, reading trails, and unresolved stubs.
- [ ] Support maps of content as Markdown pages with generated sections.
- [ ] Support explicit ordered reading trails.
- [ ] Generate unresolved stub lists from missing wikilinks/internal links.

## Links and Backlinks

- [ ] Add backlinks by scanning internal links and showing "Linked from" on note pages.
- [ ] Store backlink data once at build time.
- [ ] Show backlink title and short excerpt.
- [ ] Hide backlinks when a note has none.
- [ ] Add backlink cards inspired (footer context).
- [ ] Show linked-from notes as compact cards with title and excerpt.
- [ ] Group or paginate large backlink sets.
- [ ] Add basic wikilink support for `[[note]]` and `[[note|label]]`.
- [ ] Resolve wikilinks against `pathForDoc` output.
- [ ] Make ambiguous wikilinks fail with a clear build error.
- [ ] Defer wikilink anchors, block references, and embeds.
- [ ] Add active-link highlighting for stacked or previewed notes.
- [ ] Highlight source links when their destinations are open beside them.
- [ ] Keep active-link highlighting readable with visited-link styles.

## Related Notes and Previews

- [ ] Add "related notes" based on shared tags, backlinks, outbound links, and folder proximity.
- [ ] Score related notes with simple weights.
- [ ] Show related notes below the article or in the right rail.
- [ ] Exclude current, hidden, draft, and previous/next notes from related notes.
- [ ] Add hover previews for internal links, using prebuilt excerpts instead of fetching whole pages.
- [ ] Generate preview payloads at build time.
- [ ] Keep hover previews text-first in the first pass.
- [ ] Disable or simplify hover previews on touch/mobile.

## Reading Layout

- [ ] Add Notion-style note metadata at the top of each note.
- [ ] Show updated date, tags, status, and optional description below note titles.
- [ ] Reuse note metadata across pages, listings, previews, and related-note cards.
- [ ] Add Notion-style listing cards for home, folder, tag, and related-note lists.
- [ ] Include title, excerpt, tags/status, updated date, and optional thumbnail in listing cards.
- [x] Use compact rows instead of card grids for dense archive views.
- [ ] Add previous/next navigation within meaningful sequences.
- [ ] Use explicit trails before folder order for previous/next navigation.
- [ ] Show title, tags/status, and direction labels in previous/next links.
- [x] Add a right rail for contextual discovery on wide screens.
- [ ] Put table of contents, backlinks, related notes, latest notes, and same-folder notes in the right rail.
- [x] Collapse the right rail below the article on narrow screens.
- [ ] Add vertical stacked note reading as an experimental mode.
- [ ] Open internal links in adjacent panes in stacked-note mode.
- [ ] Keep the current page as the canonical URL in stacked-note mode.
- [ ] Encode stacked-note state in the query string only if needed.
- [ ] Use fixed-width note columns on desktop in stacked-note mode.
- [ ] Fall back to normal navigation for stacked-note links on mobile.

## Markdown Blocks and Media

- [ ] Add richer Markdown block styling inspired by Notion.
- [ ] Polish callout styling.
- [ ] Polish quote styling.
- [ ] Polish table styling.
- [ ] Polish equation styling.
- [ ] Polish image caption styling.
- [ ] Polish bookmark/link-preview styling.
- [ ] Polish code block styling.
- [ ] Use native `details` elements for toggles.
- [ ] Add image lightbox behavior only for content images that benefit from inspection.
- [ ] Keep content images accessible without JavaScript.
- [ ] Avoid loading lightbox code globally.
- [ ] Add transclusion for simple note embeds with `![[note]]`, limited to full-note embeds at first.
- [ ] Render transcluded notes as embedded blocks with title and canonical link.
- [ ] Detect circular transclusions at build time.
- [ ] Defer section/block transclusion.

## Search and Indexing

- [ ] Add a command/search overlay rather than relying only on the embedded Pagefind widget.
- [ ] Reuse Pagefind for command/search overlay results.
- [ ] Add keyboard navigation to the command/search overlay.
- [ ] Show recent notes in the command/search overlay when the query is empty.
- [ ] Add a JSON content index that powers graph, backlinks, related notes, and future interactive features.
- [ ] Keep Pagefind as the full-text search index.
- [ ] Keep the JSON content index separate from Pagefind.
- [ ] Store path, title, excerpt, tags, status, dates, folder, outbound links, and backlinks in the JSON content index.
- [ ] Generate the JSON content index from the same content scan used for backlinks and related notes.

## Content Quality

- [ ] Add content health checks for orphan pages, duplicate titles, broken anchors, missing descriptions, and huge pages.
- [ ] Run content health checks as a script before making them build-blocking.
- [ ] Report exact file paths and suggested fixes in content health checks.
- [ ] Track unresolved internal links and show them as "missing notes" during build or on a private report page.
- [ ] Treat unresolved wikilinks as intentional future-note stubs.
- [ ] Treat unresolved Markdown links as likely errors unless explicitly marked.
