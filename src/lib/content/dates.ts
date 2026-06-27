import proc from "node:child_process";
import fs from "node:fs";
export { displayDate, formatDate } from "$lib/utils/dates";
import type { DocEntry } from "./tree";

const contentDir = "src/content/docs";
const dateCache = new Map<string, Date>();

export function gitUpdatedDateForDoc(entry: DocEntry) {
  const filePath = filePathForDoc(entry);
  const cached = dateCache.get(filePath);
  if (cached) return cached;

  const date = readGitDate(filePath) ?? readModifiedDate(filePath);
  dateCache.set(filePath, date);
  return date;
}

function filePathForDoc(entry: DocEntry) {
  const path = `${contentDir}/${entry.id}`;
  const readmePath = path.replace(/(^|\/)readme$/i, "$1README");
  return (
    [
      path,
      `${path}.md`,
      `${path}.mdx`,
      `${readmePath}.md`,
      `${readmePath}.mdx`,
      `${path}/index.md`,
      `${path}/index.mdx`,
      `${path}/README.md`,
      `${path}/README.mdx`,
    ].find((candidate) => fs.existsSync(candidate)) ?? path
  );
}

function readGitDate(filePath: string) {
  try {
    const output = proc
      .execFileSync("git", ["log", "-1", "--format=%aI", "--", filePath], {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      })
      .trim();

    const date = new Date(output);
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

const readModifiedDate = (filePath: string) => fs.statSync(filePath).mtime;
