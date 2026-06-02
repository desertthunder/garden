/**
 * Converts a file path to a page slug
 * Example: "src/content/docs/programming/python/logging.md" -> "programming/python/logging"
 */
export function pathToSlug(filePath: string, contentDir: string): string {
  let slug = filePath.replace(contentDir, "").replace(/^\//, "");
  slug = slug.replace(/\.(md|mdx)$/, "");
  slug = slug.replace(/\/index$/, "");

  if (slug === "index") {
    slug = "";
  }

  return slug;
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extracts the page title from a markdown file path.
 * Index pages use their route segment so multiple index files are not all
 * rendered as "Index" in the changelog.
 * Example: "src/content/docs/programming/index.md" -> "Programming"
 */
export function extractTitle(filePath: string, contentDir = "src/content/docs"): string {
  const slug = pathToSlug(filePath, contentDir);
  if (!slug) return "Home";
  const parts = slug.split("/");
  const lastSegment = parts[parts.length - 1] || "";
  return toTitleCase(lastSegment);
}

/**
 * Formats a date string to a readable format (UTC)
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
