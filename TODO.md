# Task Parking Lot

- [ ] Export to PDF
- [ ] Standard Site integration?

## Organization

- [ ] Add folder listing pages for every content folder, using existing
  `pathForDoc` behavior.
- [ ] Replace the flat sidebar groups with a server-rendered file tree/explorer.
- [ ] Add backlinks by scanning internal links and showing "Linked from" on note
  pages.
- [ ] Add basic wikilink support for `[[note]]` and `[[note|label]]`.
- [ ] Add `tags` frontmatter, plus `/tags/` and per-tag listing pages.
- [ ] Add true recent notes using explicit `updated` frontmatter or git-derived
  dates.
- [ ] Add hover previews for internal links, using prebuilt excerpts instead of
  fetching whole pages.
- [ ] Add note maturity/status frontmatter such as seedling, growing, evergreen,
  or archived.
- [ ] Add "related notes" based on shared tags, backlinks, outbound links, and
  folder proximity.
- [ ] Add generated collection pages: maps of content, topic hubs, reading
  trails, and unresolved stubs.
- [ ] Add transclusion for simple note embeds with `![[note]]`, limited to
  full-note embeds at first.
- [ ] Add private/draft filtering with explicit `draft: true` & `publish: false`
  frontmatter.
- [ ] Add content health checks for orphan pages, duplicate titles, broken
  anchors, missing descriptions, and huge pages.
- [ ] Track unresolved internal links and show them as "missing notes" during
  build or on a private report page.

## Open Question

- [ ] Add a JSON content index that powers graph, backlinks, related notes, and
  future interactive features.
  - How might this work with pagefind?
