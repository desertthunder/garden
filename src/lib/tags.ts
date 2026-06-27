import type { DocEntry } from "./content/tree";

export function tagsForDoc(entry: DocEntry) {
  return [...new Set(entry.data.tags ?? [])].toSorted((a, b) => a.localeCompare(b));
}

export function tagSlug(tag: string) {
  return encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"));
}

export function tagTitle(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
