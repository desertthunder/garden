import { displayDate } from "$lib/content/dates";

type SearchNote = { excerpt: string; path: string; tags: string[]; title: string; updated: string };
type PagefindResultData = { url: string };
type PagefindSearchResult = { data: () => Promise<PagefindResultData> };

type PagefindModule = {
  init: () => Promise<void> | void;
  options: (options: { bundlePath: string }) => Promise<void> | void;
  search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
};

const pathParts = (path: string) => path.split("/").filter(Boolean);

const ensureTrailingSlash = (path: string) => (path === "/" ? path : `/${pathParts(path).join("/")}/`);

const root = document.querySelector<HTMLElement>("[data-search-overlay]");

if (root) {
  const base = root.dataset.base || "";
  const contentIndexPath = root.dataset.contentIndex || "/content-index.json";
  const pagefindBundlePath = root.dataset.pagefindBundle || "/pagefind/";

  const trigger = root.querySelector<HTMLButtonElement>("[data-search-open]");
  const dialog = root.querySelector<HTMLDialogElement>("[data-search-dialog]");
  const panel = root.querySelector<HTMLElement>("[data-search-panel]");
  const input = root.querySelector<HTMLInputElement>("[data-search-input]");
  const close = root.querySelector<HTMLButtonElement>("[data-search-close]");
  const status = root.querySelector<HTMLElement>("[data-search-status]");
  const results = root.querySelector<HTMLElement>("[data-search-results]");

  if (!trigger || !dialog || !panel || !input || !close || !status || !results) {
    throw new Error("Search overlay markup is incomplete");
  }

  let notesPromise: Promise<SearchNote[]> | undefined;
  let pagefindPromise: Promise<PagefindModule> | undefined;
  let searchTimer: number | undefined;
  let searchRun = 0;

  function ensureNotes() {
    notesPromise ??= fetch(contentIndexPath)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load content index");
        return response.json();
      })
      .then((data: { notes?: SearchNote[] }) => data.notes ?? []);
    return notesPromise;
  }

  async function ensurePagefind() {
    pagefindPromise ??= import(`${pagefindBundlePath}pagefind.js`).then(async (pagefind: PagefindModule) => {
      await pagefind.options({ bundlePath: pagefindBundlePath });
      await pagefind.init();
      return pagefind;
    });
    return pagefindPromise;
  }

  function normalizePath(url: string) {
    const pathname = new URL(url, window.location.origin).pathname;
    const withoutBase = base && pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : pathname;
    return ensureTrailingSlash(withoutBase || "/");
  }

  const setStatus = (message: string) => (status.textContent = message);

  const clearResults = () => results.replaceChildren();

  async function renderNotes(notes: SearchNote[], { emptyMessage }: { emptyMessage: string }) {
    clearResults();

    if (notes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = emptyMessage;
      if (results) results.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const note of notes) {
      const item = document.createElement("a");
      item.className = "search-result";
      item.href = `${base}${note.path}`;
      item.setAttribute("role", "listitem");

      const title = document.createElement("span");
      title.className = "search-result__title";
      title.textContent = note.title;

      const excerpt = document.createElement("span");
      excerpt.className = "search-result__excerpt";
      excerpt.textContent = note.excerpt;

      const meta = document.createElement("span");
      meta.className = "search-result__meta";
      meta.textContent = [displayDate(note.updated), ...note.tags.slice(0, 3)].join(" · ");

      item.append(title, excerpt, meta);
      fragment.append(item);
    }

    if (results) results.append(fragment);
  }

  async function renderRecent() {
    const notes = await ensureNotes();
    setStatus("Recent notes");
    renderNotes(
      notes
        .toSorted((a, b) => Date.parse(b.updated) - Date.parse(a.updated) || a.title.localeCompare(b.title))
        .slice(0, 7),
      { emptyMessage: "No notes found." },
    );
  }

  async function search(query: string) {
    const run = ++searchRun;

    if (!query) {
      await renderRecent();
      return;
    }

    setStatus("Searching...");

    try {
      const [notes, pagefind] = await Promise.all([ensureNotes(), ensurePagefind()]);
      const noteByPath = new Map(notes.map((note) => [note.path, note]));
      const search = await pagefind.search(query);
      const pagefindResults = await Promise.all(search.results.slice(0, 25).map((result) => result.data()));

      if (run !== searchRun) return;

      const hydratedResults = pagefindResults
        .map((result) => noteByPath.get(normalizePath(result.url)))
        .filter(
          (note, index, notes): note is SearchNote =>
            Boolean(note) && notes.findIndex((candidate) => candidate?.path === note?.path) === index,
        )
        .slice(0, 10);

      setStatus(`${hydratedResults.length} note${hydratedResults.length === 1 ? "" : "s"}`);
      renderNotes(hydratedResults, { emptyMessage: `No results for "${query}".` });
    } catch {
      if (run !== searchRun) return;
      setStatus("Search is unavailable");
      renderNotes([], { emptyMessage: "The search index could not be loaded." });
    }
  }

  async function openSearch() {
    if (dialog && !dialog.open) dialog.showModal();
    if (input) {
      input.focus();
      input.select();
    }
    await renderRecent();
    ensurePagefind();
  }

  trigger.addEventListener("click", openSearch);
  close.addEventListener("click", () => dialog.close());
  input.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => search(input.value.trim()), 180);
  });

  input.addEventListener("focus", () => {
    ensurePagefind();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target instanceof Node && !panel.contains(event.target)) dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable);

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      openSearch();
    }
  });
}
