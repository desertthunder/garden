import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FileChange } from "../lib/git";
import { groupChangesByDate } from "../lib/git";

describe("groupChangesByDate", () => {
  const createFileChange = (type: "A" | "M" | "D", path: string, dateStr: string): FileChange => ({
    type,
    path,
    date: new Date(dateStr),
    commit: "abc123",
    message: "Test commit",
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

  it("categorizes changes by type", () => {
    const changes: FileChange[] = [
      createFileChange("A", "added.md", "2025-01-15T10:00:00Z"),
      createFileChange("M", "modified.md", "2025-01-15T11:00:00Z"),
      createFileChange("D", "deleted.md", "2025-01-15T12:00:00Z"),
    ];

    const result = groupChangesByDate(changes);

    expect(result).toHaveLength(1);
    expect(result[0].added).toHaveLength(1);
    expect(result[0].modified).toHaveLength(1);
    expect(result[0].removed).toHaveLength(1);
    expect(result[0].added[0].path).toBe("added.md");
    expect(result[0].modified[0].path).toBe("modified.md");
    expect(result[0].removed[0].path).toBe("deleted.md");
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

  it("groups multiple changes on same date", () => {
    const changes: FileChange[] = [
      createFileChange("A", "file1.md", "2025-01-15T10:00:00Z"),
      createFileChange("A", "file2.md", "2025-01-15T11:00:00Z"),
      createFileChange("M", "file3.md", "2025-01-15T12:00:00Z"),
      createFileChange("M", "file4.md", "2025-01-15T13:00:00Z"),
    ];

    const result = groupChangesByDate(changes);

    expect(result).toHaveLength(1);
    expect(result[0].added).toHaveLength(2);
    expect(result[0].modified).toHaveLength(2);
    expect(result[0].removed).toHaveLength(0);
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

    expect(result[0].added[0]).toMatchObject({
      type: "A",
      path: "test.md",
      commit: "abc123def456",
      message: "Add test file",
      author: "John Doe",
    });
  });
});
