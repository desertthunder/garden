import { describe, it, expect } from "vitest";
import { pathToSlug, extractTitle, formatDate } from "../lib/utils";

describe("pathToSlug", () => {
  const contentDir = "src/content/docs";

  it("converts file path to slug", () => {
    const result = pathToSlug("src/content/docs/programming/python/logging.md", contentDir);
    expect(result).toBe("programming/python/logging");
  });

  it("handles mdx files", () => {
    const result = pathToSlug("src/content/docs/engineering/databases/postgres.mdx", contentDir);
    expect(result).toBe("engineering/databases/postgres");
  });

  it("removes index from path", () => {
    const result = pathToSlug("src/content/docs/guide/index.md", contentDir);
    expect(result).toBe("guide");
  });

  it("handles root index", () => {
    const result = pathToSlug("src/content/docs/index.md", contentDir);
    expect(result).toBe("");
  });

  it("handles paths without leading slash", () => {
    const result = pathToSlug("content/docs/test.md", "content/docs");
    expect(result).toBe("test");
  });
});

describe("extractTitle", () => {
  it("extracts title from simple filename", () => {
    const result = extractTitle("src/content/docs/introduction.md");
    expect(result).toBe("Introduction");
  });

  it("converts kebab-case to Title Case", () => {
    const result = extractTitle("src/content/docs/getting-started.md");
    expect(result).toBe("Getting Started");
  });

  it("converts snake_case to Title Case", () => {
    const result = extractTitle("src/content/docs/data_structures.md");
    expect(result).toBe("Data Structures");
  });

  it("handles mixed case", () => {
    const result = extractTitle("src/content/docs/quick-start_guide.md");
    expect(result).toBe("Quick Start Guide");
  });

  it("handles single word", () => {
    const result = extractTitle("src/content/docs/about.md");
    expect(result).toBe("About");
  });

  it("handles complex paths", () => {
    const result = extractTitle("src/content/docs/programming/python/named-tuple.md");
    expect(result).toBe("Named Tuple");
  });
});

describe("formatDate", () => {
  it("formats ISO date string", () => {
    const result = formatDate("2025-01-15");
    expect(result).toBe("January 15, 2025");
  });

  it("formats different months", () => {
    const result = formatDate("2024-12-25");
    expect(result).toBe("December 25, 2024");
  });

  it("handles single digit dates", () => {
    const result = formatDate("2025-03-05");
    expect(result).toBe("March 5, 2025");
  });
});
