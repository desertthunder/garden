import type { AstroIntegration } from "astro";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createIndex, type PagefindServiceConfig } from "pagefind";

type SearchIntegrationOptions = {
  indexConfig?: PagefindServiceConfig;
};

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
};

export default function search({ indexConfig }: SearchIntegrationOptions = {}): AstroIntegration {
  return {
    name: "garden-search",
    hooks: {
      "astro:server:setup": ({ server, logger }) => {
        const outDir = path.join(server.config.root, server.config.build.outDir, "pagefind");
        const base = server.config.base.replace(/\/$/, "");
        const pagefindPath = `${base}/pagefind/`.replace(/\/{2,}/g, "/");

        server.middlewares.use(async (request, response, next) => {
          const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

          if (!pathname.startsWith(pagefindPath)) {
            next();
            return;
          }

          const relativePath = decodeURIComponent(pathname.slice(pagefindPath.length));
          const filePath = path.join(outDir, relativePath);
          const safePath = path.relative(outDir, filePath);

          if (safePath.startsWith("..") || path.isAbsolute(safePath)) {
            response.statusCode = 400;
            response.end("Bad request");
            return;
          }

          try {
            const file = await stat(filePath);

            if (!file.isFile()) {
              next();
              return;
            }

            response.setHeader("Content-Type", contentTypes[path.extname(filePath)] ?? "application/octet-stream");
            createReadStream(filePath).pipe(response);
          } catch {
            logger.debug(`No Pagefind asset found at ${filePath}`);
            next();
          }
        });
      },
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const { index, errors: createErrors } = await createIndex(indexConfig);

        if (!index) {
          throw new Error(`Pagefind failed to create index:\n${createErrors.join("\n")}`);
        }

        const { page_count, errors: addErrors } = await index.addDirectory({ path: outDir });

        if (addErrors.length > 0) {
          throw new Error(`Pagefind failed to index files:\n${addErrors.join("\n")}`);
        }

        logger.info(`Pagefind indexed ${page_count} pages`);

        const { outputPath, errors: writeErrors } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });

        if (writeErrors.length > 0) {
          throw new Error(`Pagefind failed to write index:\n${writeErrors.join("\n")}`);
        }

        logger.info(`Pagefind wrote index to ${outputPath}`);
      },
    },
  };
}
