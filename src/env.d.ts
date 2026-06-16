/// <reference types="astro/client" />

declare module "virtual:garden-changelog-config" {
  import type { ChangelogConfig } from "./plugins/changelog/index";

  const config: Required<ChangelogConfig>;
  export default config;
}
