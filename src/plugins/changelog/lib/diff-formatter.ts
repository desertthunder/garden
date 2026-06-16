/**
 * Formats a git diff string into HTML with syntax highlighting
 */
export function formatDiff(diff: string): string {
  const lines = diff.split("\n");
  const formatted = lines
    .map((line) => {
      const escaped = escapeHtml(line);

      if (line.startsWith("+++") || line.startsWith("---")) {
        return `<span class="diff-file">${escaped}</span>`;
      }
      if (line.startsWith("@@")) {
        return `<span class="diff-hunk">${escaped}</span>`;
      }
      if (line.startsWith("+")) {
        return `<span class="diff-add">${escaped}</span>`;
      }
      if (line.startsWith("-")) {
        return `<span class="diff-remove">${escaped}</span>`;
      }
      return `<span class="diff-context">${escaped}</span>`;
    })
    .join("\n");

  return formatted;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
