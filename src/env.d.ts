/// <reference types="astro/client" />

declare module "virtual:starlight-changelog-config" {
  import type { StarlightChangelogConfig } from "./plugins/starlight-changelog/index";

  const config: Required<StarlightChangelogConfig>;
  export default config;
}
