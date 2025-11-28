import type { StarlightChangelogConfig } from "../index.js";
import { getGitLog, groupChangesByDate } from "./git.js";

/**
 * Gets changelog data for the route
 */
export function starlightChangelogRoute(config: Required<StarlightChangelogConfig>) {
  return {
    getChangelog() {
      const changes = getGitLog(config.contentDir, config.historyDays);
      return groupChangesByDate(changes);
    },
    config,
  };
}
