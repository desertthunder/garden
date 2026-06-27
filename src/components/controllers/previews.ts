type NotePreview = { date?: string; excerpt?: string; tags?: string[]; title?: string };

const data = document.getElementById("note-preview-data");
const content = document.querySelector<HTMLElement>(".content");

if (data && content) {
  const previewData = JSON.parse(data.textContent ?? "{}") as Record<string, NotePreview>;
  const basePath = document.documentElement.dataset.basePath ?? "";
  const previewCard = document.createElement("div");
  const title = document.createElement("strong");
  const meta = document.createElement("small");
  const excerpt = document.createElement("span");

  previewCard.className = "note-preview";
  previewCard.append(title, meta, excerpt);
  document.body.append(previewCard);

  function normalizePreviewPath(href: string) {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return undefined;
    if (basePath && !url.pathname.startsWith(`${basePath}/`)) return undefined;
    const path = basePath ? url.pathname.slice(basePath.length) : url.pathname;
    return path.endsWith("/") ? path : `${path}/`;
  }

  function hidePreview() {
    previewCard.classList.remove("is-visible");
  }

  function showPreview(link: HTMLAnchorElement, preview: NotePreview) {
    title.textContent = preview.title ?? "";
    meta.textContent = [preview.date, ...(preview.tags ?? [])].filter(Boolean).join(" \u00b7 ");
    excerpt.textContent = preview.excerpt ?? "";
    previewCard.classList.add("is-visible");

    const linkRect = link.getBoundingClientRect();
    const cardRect = previewCard.getBoundingClientRect();
    const gap = 8;
    const left = Math.min(Math.max(gap, linkRect.left), window.innerWidth - cardRect.width - gap);
    const bottomTop = linkRect.bottom + gap;
    const top =
      bottomTop + cardRect.height <= window.innerHeight - gap
        ? bottomTop
        : Math.max(gap, linkRect.top - cardRect.height - gap);

    previewCard.style.left = `${left}px`;
    previewCard.style.top = `${top}px`;
  }

  content.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    const path = normalizePreviewPath(link.href);
    const preview = path ? previewData[path] : undefined;
    if (!preview) return;

    link.classList.add("has-note-preview");
    link.addEventListener("mouseenter", () => showPreview(link, preview));
    link.addEventListener("focus", () => showPreview(link, preview));
    link.addEventListener("mouseleave", hidePreview);
    link.addEventListener("blur", hidePreview);
  });

  window.addEventListener("scroll", hidePreview, true);
  window.addEventListener("resize", hidePreview);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hidePreview();
  });
}
