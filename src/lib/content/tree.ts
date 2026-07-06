import type { CollectionEntry } from "astro:content";
import { gitUpdatedDateForDoc } from "./dates";
import { pathForDoc } from "./paths";

export type DocEntry = CollectionEntry<"docs">;

export type NoteListItem = { entry: DocEntry; path: string; updated: Date };

export type FolderItem = { label: string; path: string; entry?: DocEntry };

export type SidebarNode =
  | { kind: "folder"; children: SidebarNode[]; label: string; path: string }
  | { kind: "note"; label: string; path: string };

type IndexedContent = { entriesByPath: Map<string, DocEntry>; folderPaths: Set<string>; notes: NoteListItem[] };

export function buildSidebarTree(entries: DocEntry[]) {
  const content = indexContent(entries);
  const nodes: SidebarNode[] = [];
  const home = content.entriesByPath.get("/");

  if (home) {
    nodes.push({ kind: "note", label: home.data.title, path: "/" });
  }

  nodes.push(...nodesForFolder("/", content));
  return nodes;
}

export function folderPathsForEntries(entries: DocEntry[]) {
  return [...indexContent(entries).folderPaths].sort((a, b) => a.localeCompare(b));
}

export function folderListingForPath(entries: DocEntry[], folderPath: string) {
  const content = indexContent(entries);
  const path = ensureTrailingSlash(folderPath);

  return {
    entry: content.entriesByPath.get(path),
    folders: childFolders(path, content),
    label: folderLabel(path, content),
    notes: content.notes
      .filter((note) => note.path !== path && note.path.startsWith(path))
      .sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title)),
    path,
  };
}

function indexContent(entries: DocEntry[]): IndexedContent {
  const entriesByPath = new Map<string, DocEntry>();
  const folderPaths = new Set<string>();

  for (const entry of entries) {
    const path = pathForDoc(entry);
    entriesByPath.set(path, entry);

    const parts = pathParts(path);
    for (let index = 1; index < parts.length; index += 1) {
      folderPaths.add(pathFromParts(parts.slice(0, index)));
    }
  }

  const notes = entries
    .map((entry) => ({ entry, path: pathForDoc(entry), updated: gitUpdatedDateForDoc(entry) }))
    .filter((note) => note.path !== "/" && !folderPaths.has(note.path));

  return { entriesByPath, folderPaths, notes };
}

function nodesForFolder(parentPath: string, content: IndexedContent): SidebarNode[] {
  const folders = childFolders(parentPath, content).map((folder) => ({
    kind: "folder" as const,
    children: nodesForFolder(folder.path, content),
    label: folder.label,
    path: folder.path,
  }));

  const notes = childNotes(parentPath, content).map((note) => ({
    kind: "note" as const,
    label: note.entry.data.title,
    path: note.path,
  }));

  return [...folders, ...notes];
}

function childFolders(parentPath: string, content: IndexedContent): FolderItem[] {
  return [...content.folderPaths]
    .filter((path) => parentPathFor(path) === parentPath)
    .map((path) => ({ entry: content.entriesByPath.get(path), label: folderLabel(path, content), path }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function childNotes(parentPath: string, content: IndexedContent) {
  return content.notes
    .filter((note) => parentPathFor(note.path) === parentPath)
    .sort((a, b) => a.entry.data.title.localeCompare(b.entry.data.title));
}

function folderLabel(path: string, content: IndexedContent) {
  return content.entriesByPath.get(path)?.data.title ?? titleFromSegment(pathParts(path).at(-1) ?? "Home");
}

function parentPathFor(path: string) {
  const parts = pathParts(path);
  return parts.length <= 1 ? "/" : pathFromParts(parts.slice(0, -1));
}

function pathParts(path: string) {
  return path.split("/").filter(Boolean);
}

function pathFromParts(parts: string[]) {
  return `/${parts.join("/")}/`;
}

function ensureTrailingSlash(path: string) {
  return path === "/" ? path : `/${pathParts(path).join("/")}/`;
}

function titleFromSegment(segment: string) {
  return segment
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
