import { execSync } from "node:child_process";
import { join } from "node:path";

export type ChangeType = "A" | "M" | "D";

export interface FileChange {
  type: ChangeType;
  path: string;
  date: Date;
  commit: string;
  message: string;
  author: string;
}

export interface ChangelogEntry {
  date: string;
  added: FileChange[];
  modified: FileChange[];
  removed: FileChange[];
}

/**
 * Executes a git command and returns the output
 */
function execGit(args: string[], cwd: string): string {
  try {
    return execSync(`git ${args.join(" ")}`, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    throw new Error(
      `Git command failed: git ${args.join(" ")}\n${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Gets git log entries for a specific directory
 */
export function getGitLog(
  contentDir: string,
  historyDays: number,
): FileChange[] {
  const since = new Date();
  since.setDate(since.getDate() - historyDays);
  const sinceStr = since.toISOString().split("T")[0];

  const format = [
    "%H", // commit hash
    "%aI", // author date (ISO format)
    "%an", // author name
    "%s", // subject
  ].join("%x1f"); // Use ASCII unit separator

  const args = [
    "log",
    `--since="${sinceStr}"`,
    "--name-status",
    `--pretty=format:${format}`,
    "--",
    contentDir,
  ];

  const output = execGit(args, process.cwd());
  if (!output) return [];

  return parseGitLog(output);
}

/**
 * Parses git log output into FileChange objects
 */
function parseGitLog(output: string): FileChange[] {
  const changes: FileChange[] = [];
  const lines = output.split("\n");
  let currentCommit: {
    hash: string;
    date: Date;
    author: string;
    message: string;
  } | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    // Check if this is a commit header
    if (!line.startsWith("A\t") && !line.startsWith("M\t") && !line.startsWith("D\t")) {
      const [hash, dateStr, author, message] = line.split("\x1f");
      const date = new Date(dateStr || "");

      // Skip commits with invalid dates
      if (isNaN(date.getTime())) {
        currentCommit = null;
        continue;
      }

      currentCommit = {
        hash: hash || "",
        date,
        author: author || "",
        message: message || "",
      };
      continue;
    }

    if (!currentCommit) continue;

    // Parse file change line (format: "STATUS\tPATH")
    const [status, path] = line.split("\t");
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
 * Gets the diff for a specific file at a specific commit
 */
export function getFileDiff(
  filePath: string,
  commit: string,
  maxLines: number,
): string {
  try {
    const args = [
      "diff",
      `${commit}^`,
      commit,
      "--unified=3",
      "--",
      filePath,
    ];

    const diff = execGit(args, process.cwd());
    if (!diff) return "";

    // Take only first N lines of the diff
    const lines = diff.split("\n");
    const relevantLines = lines.slice(0, maxLines);

    return relevantLines.join("\n");
  } catch {
    return "";
  }
}

/**
 * Groups file changes by date
 */
export function groupChangesByDate(changes: FileChange[]): ChangelogEntry[] {
  const grouped = new Map<string, ChangelogEntry>();

  for (const change of changes) {
    const dateKey = change.date.toISOString().split("T")[0];

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, {
        date: dateKey,
        added: [],
        modified: [],
        removed: [],
      });
    }

    const entry = grouped.get(dateKey)!;

    switch (change.type) {
      case "A":
        entry.added.push(change);
        break;
      case "M":
        entry.modified.push(change);
        break;
      case "D":
        entry.removed.push(change);
        break;
    }
  }

  // Sort by date descending
  return Array.from(grouped.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
