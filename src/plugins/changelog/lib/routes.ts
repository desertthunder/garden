import type { ChangelogConfig } from "../index.js";
import { getGitLog, groupChangesByDate } from "./git.js";

/**
 * Gets changelog data for the route
 */
export function changelogRoute(config: Required<ChangelogConfig>) {
  return {
    getChangelog() {
      const changes = getGitLog(config.contentDir, config.historyDays);
      return groupChangesByDate(changes);
    },
    config,
  };
}
