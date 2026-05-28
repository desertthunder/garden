import { describe, it, expect } from "vitest";
import type { ChangeType, FileChange } from "../lib/git";
import { groupChangesByDate } from "../lib/git";

describe("groupChangesByDate", () => {
  const createFileChange = (type: ChangeType, path: string, dateStr: string, commit = "abc123"): FileChange => ({
    type,
    path,
    date: new Date(dateStr),
    commit,
    message: `Test commit ${commit}`,
    author: "Test Author",
  });

  it("groups changes by date", () => {
    const changes: FileChange[] = [
      createFileChange("A", "file1.md", "2025-01-15T10:00:00Z"),
      createFileChange("M", "file2.md", "2025-01-15T11:00:00Z"),
      createFileChange("D", "file3.md", "2025-01-14T10:00:00Z"),
    ];

    const result = groupChangesByDate(changes);

    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2025-01-15");
    expect(result[1].date).toBe("2025-01-14");
  });

  it("groups changes by commit within each date", () => {
    const changes: FileChange[] = [
      createFileChange("A", "added.md", "2025-01-15T10:00:00Z", "abc123"),
      createFileChange("M", "modified.md", "2025-01-15T10:01:00Z", "abc123"),
      createFileChange("D", "deleted.md", "2025-01-15T12:00:00Z", "def456"),
    ];

    const result = groupChangesByDate(changes);

    expect(result).toHaveLength(1);
    expect(result[0].commits).toHaveLength(2);
    expect(result[0].commits[0].commit).toBe("def456");
    expect(result[0].commits[1].commit).toBe("abc123");
  });

  it("categorizes changes by type inside a commit", () => {
    const changes: FileChange[] = [
      createFileChange("A", "added.md", "2025-01-15T10:00:00Z"),
      createFileChange("M", "modified.md", "2025-01-15T11:00:00Z"),
      createFileChange("D", "deleted.md", "2025-01-15T12:00:00Z"),
      { ...createFileChange("R", "new.md", "2025-01-15T13:00:00Z"), oldPath: "old.md" },
    ];

    const result = groupChangesByDate(changes);
    const commit = result[0].commits[0];

    expect(commit.added).toHaveLength(1);
    expect(commit.modified).toHaveLength(1);
    expect(commit.removed).toHaveLength(1);
    expect(commit.renamed).toHaveLength(1);
    expect(commit.added[0].path).toBe("added.md");
    expect(commit.modified[0].path).toBe("modified.md");
    expect(commit.removed[0].path).toBe("deleted.md");
    expect(commit.renamed[0].path).toBe("new.md");
    expect(commit.renamed[0].oldPath).toBe("old.md");
  });

  it("sorts dates in descending order", () => {
    const changes: FileChange[] = [
      createFileChange("A", "file1.md", "2025-01-10T10:00:00Z"),
      createFileChange("A", "file2.md", "2025-01-15T10:00:00Z"),
      createFileChange("A", "file3.md", "2025-01-12T10:00:00Z"),
    ];

    const result = groupChangesByDate(changes);

    expect(result).toHaveLength(3);
    expect(result[0].date).toBe("2025-01-15");
    expect(result[1].date).toBe("2025-01-12");
    expect(result[2].date).toBe("2025-01-10");
  });

  it("handles empty changes array", () => {
    const result = groupChangesByDate([]);
    expect(result).toHaveLength(0);
  });

  it("preserves file change metadata", () => {
    const changes: FileChange[] = [
      {
        type: "A",
        path: "test.md",
        date: new Date("2025-01-15T10:00:00Z"),
        commit: "abc123def456",
        message: "Add test file",
        author: "John Doe",
      },
    ];

    const result = groupChangesByDate(changes);

    expect(result[0].commits[0]).toMatchObject({ commit: "abc123def456", message: "Add test file", author: "John Doe" });
    expect(result[0].commits[0].added[0]).toMatchObject({
      type: "A",
      path: "test.md",
      commit: "abc123def456",
      message: "Add test file",
      author: "John Doe",
    });
  });
});
