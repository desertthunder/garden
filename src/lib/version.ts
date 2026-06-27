import proc from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type PackageJson = { version: string };
type BuildVersion = { commit: string; display: string; version: string };

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as PackageJson;

function gitOutput(args: string[]) {
  try {
    return proc.execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

function getVersion(version: string) {
  const verify = gitOutput(["rev-parse", "--verify", version]);
  if (verify === null) return version;
  return gitOutput(["describe", "--tags", "--abbrev=0", "--match", "v[0-9]*"]);
}

function buildVersionDetails(version: string): BuildVersion {
  const versionTag = `v${version}`;
  const tag = getVersion(versionTag) ?? versionTag;
  const count = gitOutput(tag ? ["rev-list", "--count", `${tag}..HEAD`] : ["rev-list", "--count", "HEAD"]) ?? "0";
  const commit = gitOutput(["rev-parse", "HEAD"]) ?? "unknown";
  const shortCommit = gitOutput(["rev-parse", "--short", "HEAD"]) ?? "unknown";
  const display = count === "0" ? versionTag : `${versionTag}-${count}+g${shortCommit}`;
  return { commit, display, version: tag };
}

export const buildVersion = buildVersionDetails(packageJson.version);
