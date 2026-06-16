import type { AstroIntegration } from "astro";

export type ChangelogConfig = {
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
   * Number of context lines to show around each diff hunk
   * @default 15
   */
  diffLines?: number;

  /**
   * Number of days of history to show
   * @default 90
   */
  historyDays?: number;
};

export default function changelog(userConfig?: ChangelogConfig): AstroIntegration {
  const config: Required<ChangelogConfig> = {
    path: userConfig?.path ?? "changelog",
    contentDir: userConfig?.contentDir ?? "src/content/docs",
    diffLines: userConfig?.diffLines ?? 15,
    historyDays: userConfig?.historyDays ?? 90,
  };

  return {
    name: "garden-changelog",
    hooks: {
      "astro:config:setup": ({ injectRoute, logger, updateConfig }) => {
        logger.info(`Setting up changelog at /${config.path}`);

        updateConfig({
          vite: {
            plugins: [
              {
                name: "garden-changelog-config",
                resolveId(id) {
                  return id === "virtual:garden-changelog-config" ? "\0garden-changelog-config" : undefined;
                },
                load(id) {
                  return id === "\0garden-changelog-config" ? `export default ${JSON.stringify(config)};` : undefined;
                },
              },
            ],
          },
        });

        injectRoute({
          pattern: config.path,
          entrypoint: new URL("./route.astro", import.meta.url).pathname,
          prerender: true,
        });
      },
    },
  };
}
