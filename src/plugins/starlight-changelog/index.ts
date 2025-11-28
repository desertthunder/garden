import type { StarlightPlugin } from "@astrojs/starlight/types";

export type StarlightChangelogConfig = {
  /**
   * Path prefix for the changelog page
   * @default "changelog"
   */
  path?: string;

  /**
   * Directory to track changes in
   * @default "src/content/docs"
   */
  contentDir?: string;

  /**
   * Number of lines to show in diffs
   * @default 15
   */
  diffLines?: number;

  /**
   * Number of days of history to show
   * @default 90
   */
  historyDays?: number;
};

/**
 * Starlight plugin that generates a changelog page from git history
 */
export default function starlightChangelog(userConfig?: StarlightChangelogConfig): StarlightPlugin {
  const config: Required<StarlightChangelogConfig> = {
    path: userConfig?.path ?? "changelog",
    contentDir: userConfig?.contentDir ?? "src/content/docs",
    diffLines: userConfig?.diffLines ?? 15,
    historyDays: userConfig?.historyDays ?? 90,
  };

  return {
    name: "starlight-changelog",
    hooks: {
      setup({ addIntegration, logger }) {
        logger.info(`Setting up changelog at /${config.path}`);

        addIntegration({
          name: "starlight-changelog-integration",
          hooks: {
            "astro:config:setup": ({ injectRoute }) => {
              injectRoute({
                pattern: config.path,
                entrypoint: new URL("./route.astro", import.meta.url).pathname,
                prerender: true,
              });
            },
          },
        });
      },
    },
  };
}
