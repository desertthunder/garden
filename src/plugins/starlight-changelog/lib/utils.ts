/**
 * Converts a file path to a page slug
 * Example: "src/content/docs/programming/python/logging.md" -> "programming/python/logging"
 */
export function pathToSlug(filePath: string, contentDir: string): string {
  // Remove the content directory prefix
  let slug = filePath.replace(contentDir, "").replace(/^\//, "");

  // Remove file extension
  slug = slug.replace(/\.(md|mdx)$/, "");

  // Remove index from the end
  slug = slug.replace(/\/index$/, "");

  // Handle root index case
  if (slug === "index") {
    slug = "";
  }

  return slug;
}

/**
 * Extracts the page title from a markdown file path
 * Example: "src/content/docs/programming/python/logging.md" -> "Logging"
 */
export function extractTitle(filePath: string): string {
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1] || "";
  const nameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");

  // Convert kebab-case or snake_case to Title Case
  return nameWithoutExt
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateStr: string): string {
  // Parse the date in UTC to avoid timezone issues
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
