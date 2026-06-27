import type { DocEntry } from "./tree";

export function pathForDoc(entry: DocEntry) {
  const id = "slug" in entry && typeof entry.slug === "string" ? entry.slug : entry.id;
  const cleanId = id
    .replace(/\.(md|mdx)$/i, "")
    .replace(/(^|\/)README$/i, "$1index")
    .replace(/\/?index$/, "");
  return cleanId ? `/${cleanId}/` : "/";
}
