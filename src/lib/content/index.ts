import { formatDate, gitUpdatedDateForDoc } from "$lib/content/dates";
import { pathForDoc } from "$lib/content/paths";
import { tagsForDoc } from "$lib/tags";
import type { DocEntry, NoteListItem } from "./tree";

export type ContentIndexNote = {
  backlinks: string[];
  date: string;
  description?: string;
  entry: DocEntry;
  excerpt: string;
  folder: string;
  outbound: string[];
  path: string;
  tags: string[];
  title: string;
  updated: Date;
  updatedLabel: string;
};

export type PublicContentIndexNote = Omit<ContentIndexNote, "entry" | "updated"> & { updated: string };

export function buildContentIndex(entries: DocEntry[]) {
  const folderPaths = folderPathsForEntries(entries);
  const folderPathSet = new Set(folderPaths);
  const notes = entries
    .map((entry) => ({ entry, path: pathForDoc(entry), updated: gitUpdatedDateForDoc(entry) }))
    .filter((note) => note.path !== "/" && !folderPathSet.has(note.path));
  const notePaths = new Set(notes.map((note) => note.path));
  const indexed = notes.map((note) => noteFromEntry(note, notePaths));
  const backlinksByPath = indexed.reduce((links, note) => {
    for (const outbound of note.outbound) {
      links.set(outbound, [...(links.get(outbound) ?? []), note.path]);
    }
    return links;
  }, new Map<string, string[]>());

  return indexed.map((note) => ({
    ...note,
    backlinks: (backlinksByPath.get(note.path) ?? []).sort((a, b) =>
      titleForPath(indexed, a).localeCompare(titleForPath(indexed, b)),
    ),
  }));
}

export function publicContentIndex(notes: ContentIndexNote[]): PublicContentIndexNote[] {
  return notes.map(({ entry: _entry, updated, ...note }) => ({ ...note, updated: updated.toISOString() }));
}

export function latestNotes(notes: ContentIndexNote[], limit: number, currentPath?: string): NoteListItem[] {
  return notes
    .filter((note) => note.path !== currentPath)
    .toSorted((a, b) => b.updated.getTime() - a.updated.getTime() || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map(noteListItem);
}

export function sameFolderNotes(notes: ContentIndexNote[], currentPath: string, limit: number): NoteListItem[] {
  const current = notes.find((note) => note.path === currentPath);
  if (!current) return [];
  return notes
    .filter((note) => note.path !== currentPath && note.folder === current.folder)
    .toSorted((a, b) => a.title.localeCompare(b.title))
    .slice(0, limit)
    .map(noteListItem);
}

export function backlinkNotes(notes: ContentIndexNote[], currentPath: string): NoteListItem[] {
  const noteByPath = new Map(notes.map((note) => [note.path, note]));
  return (noteByPath.get(currentPath)?.backlinks ?? [])
    .map((path) => noteByPath.get(path))
    .filter((note): note is ContentIndexNote => Boolean(note))
    .toSorted((a, b) => a.title.localeCompare(b.title))
    .map(noteListItem);
}

export function previewPayload(notes: ContentIndexNote[]) {
  return Object.fromEntries(
    notes.map((note) => [
      note.path,
      { date: note.updatedLabel, excerpt: note.excerpt, tags: note.tags, title: note.title },
    ]),
  );
}

function noteFromEntry(note: NoteListItem, notePaths: Set<string>): ContentIndexNote {
  const { entry, path, updated } = note;
  const description = entry.data.description;
  const excerpt = description ?? excerptFromBody(entry.body ?? "");

  return {
    backlinks: [],
    date: updated.toISOString(),
    description,
    entry,
    excerpt,
    folder: parentPathFor(path),
    outbound: extractInternalLinks(entry.body ?? "", path, notePaths),
    path,
    tags: tagsForDoc(entry),
    title: entry.data.title,
    updated,
    updatedLabel: formatDate(updated),
  };
}

function extractInternalLinks(body: string, fromPath: string, notePaths: Set<string>) {
  const links = [...body.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)]
    .map((match) => match[1]?.trim() ?? "")
    .filter((href) => href && !href.startsWith("#") && !/^[a-z][a-z0-9+.-]*:/i.test(href));
  const paths = links
    .map((href) => normalizeInternalPath(href, fromPath))
    .filter((path): path is string => Boolean(path));
  return [...new Set(paths.filter((path) => notePaths.has(path)))].sort((a, b) => a.localeCompare(b));
}

function normalizeInternalPath(href: string, fromPath: string) {
  const path = href.split("#")[0]?.split("?")[0];
  if (!path) return undefined;
  if (path.startsWith("/")) return ensureTrailingSlash(path);

  const baseParts = pathParts(parentPathFor(fromPath));
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") baseParts.pop();
    else baseParts.push(part);
  }

  return ensureTrailingSlash(`/${baseParts.join("/")}/`);
}

function excerptFromBody(body: string) {
  const text = body
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\([^)]+\)/g, (match) => match.replace(/^\[|\]\([^)]+\)$/g, ""))
    .replace(/[#>*_`~\-[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 180 ? `${text.slice(0, 177).trim()}...` : text;
}

function noteListItem(note: ContentIndexNote): NoteListItem {
  return { entry: note.entry, path: note.path, updated: note.updated };
}

function titleForPath(notes: ContentIndexNote[], path: string) {
  return notes.find((note) => note.path === path)?.title ?? path;
}

function folderPathsForEntries(entries: DocEntry[]) {
  const paths = new Set<string>();

  for (const entry of entries) {
    const parts = pathParts(pathForDoc(entry));
    for (let index = 1; index < parts.length; index += 1) {
      paths.add(pathFromParts(parts.slice(0, index)));
    }
  }

  return paths;
}

function parentPathFor(path: string) {
  const parts = pathParts(path);
  return parts.length <= 1 ? "/" : pathFromParts(parts.slice(0, -1));
}

const pathParts = (path: string) => path.split("/").filter(Boolean);

const pathFromParts = (parts: string[]) => `/${parts.join("/")}/`;

const ensureTrailingSlash = (path: string) => (path === "/" ? path : `/${pathParts(path).join("/")}/`);
