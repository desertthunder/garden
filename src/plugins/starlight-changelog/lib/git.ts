import { execSync } from "node:child_process";

export type ChangeType = "A" | "M" | "D" | "R";

export type FileChange = {
  type: ChangeType;
  path: string;
  oldPath?: string;
  date: Date;
  commit: string;
  message: string;
  author: string;
};

export type CommitEntry = {
  commit: string;
  message: string;
  author: string;
  date: Date;
  added: FileChange[];
  modified: FileChange[];
  removed: FileChange[];
  renamed: FileChange[];
};

export type ChangelogEntry = { date: string; commits: CommitEntry[] };

/**
 * Executes a git command and returns the output
 */
function execGit(args: string[], cwd: string): string {
  try {
    return execSync(`git ${args.join(" ")}`, { cwd, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (error) {
    throw new Error(
      `Git command failed: git ${args.join(" ")}\n${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * In order: commit hash, author date (ISO), author name, commit message,
 * separated by ASCII unit separator (0x1f) to avoid conflicts with
 * commit messages or file paths
 */
const COMMIT_ARGS_FORMAT = ["%H", "%aI", "%an", "%s"].join("%x1f");

/**
 * Gets git log entries for a specific directory
 */
export function getGitLog(contentDir: string, historyDays: number): FileChange[] {
  const since = new Date();
  since.setDate(since.getDate() - historyDays);
  const sinceStr = since.toISOString().split("T")[0];

  const args = [
    "log",
    "--find-renames",
    `--since=\"${sinceStr}\"`,
    "--name-status",
    `--pretty=format:${COMMIT_ARGS_FORMAT}`,
    "--",
    contentDir,
  ];

  const output = execGit(args, process.cwd());
  if (!output) return [];

  return parseGitLog(output);
}

/**
 * Parses git log output into FileChange objects.
 * We skip commits with invalid dates to avoid issues with malformed git history.
 */
function parseGitLog(output: string): FileChange[] {
  const changes: FileChange[] = [];
  const lines = output.split("\n");
  let currentCommit: { hash: string; date: Date; author: string; message: string } | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    const [status] = line.split("\t");
    const isChangeLine = status === "A" || status === "M" || status === "D" || status?.startsWith("R");

    if (!isChangeLine) {
      const [hash, dateStr, author, message] = line.split("\x1f");
      const date = new Date(dateStr || "");

      if (isNaN(date.getTime())) {
        currentCommit = null;
        continue;
      }

      currentCommit = { hash: hash || "", date, author: author || "", message: message || "" };
      continue;
    }

    if (!currentCommit) continue;

    const parts = line.split("\t");
    if (status?.startsWith("R")) {
      const [, oldPath, newPath] = parts;
      if (!oldPath || !newPath) continue;

      changes.push({
        type: "R",
        oldPath: oldPath.trim(),
        path: newPath.trim(),
        date: currentCommit.date,
        commit: currentCommit.hash,
        message: currentCommit.message,
        author: currentCommit.author,
      });
      continue;
    }

    const [, path] = parts;
    if (!status || !path) continue;

    const type = status.trim() as ChangeType;
    if (type === "A" || type === "M" || type === "D") {
      changes.push({
        type,
        path: path.trim(),
        date: currentCommit.date,
        commit: currentCommit.hash,
        message: currentCommit.message,
        author: currentCommit.author,
      });
    }
  }

  return changes;
}

/**
 * Gets the diff for a specific file at a specific commit,
 * taking only the first N (`maxLines`) lines of the diff.
 */
export function getFileDiff(filePath: string, commit: string, maxLines: number): string {
  try {
    const args = ["diff", `${commit}^`, commit, "--unified=3", "--", filePath];

    const diff = execGit(args, process.cwd());
    if (!diff) return "";

    const lines = diff.split("\n");
    const relevantLines = lines.slice(0, maxLines);

    return relevantLines.join("\n");
  } catch {
    return "";
  }
}

/**
 * Groups file changes first by date, then by commit.
 */
export function groupChangesByDate(changes: FileChange[]): ChangelogEntry[] {
  const grouped = new Map<string, ChangelogEntry>();
  const commitsByDate = new Map<string, Map<string, CommitEntry>>();

  for (const change of changes) {
    const dateKey = change.date.toISOString().split("T")[0];

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, { date: dateKey, commits: [] });
      commitsByDate.set(dateKey, new Map());
    }

    const commitMap = commitsByDate.get(dateKey)!;
    let commitEntry = commitMap.get(change.commit);

    if (!commitEntry) {
      commitEntry = {
        commit: change.commit,
        message: change.message,
        author: change.author,
        date: change.date,
        added: [],
        modified: [],
        removed: [],
        renamed: [],
      };
      commitMap.set(change.commit, commitEntry);
      grouped.get(dateKey)!.commits.push(commitEntry);
    }

    switch (change.type) {
      case "A":
        commitEntry.added.push(change);
        break;
      case "M":
        commitEntry.modified.push(change);
        break;
      case "D":
        commitEntry.removed.push(change);
        break;
      case "R":
        commitEntry.renamed.push(change);
        break;
    }
  }

  return Array.from(grouped.values())
    .map((entry) => ({ ...entry, commits: entry.commits.sort((a, b) => b.date.getTime() - a.date.getTime()) }))
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
