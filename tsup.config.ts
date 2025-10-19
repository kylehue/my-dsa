import { defineConfig } from "tsup";
import type { Plugin } from "tsup/node_modules/esbuild";
import { glob } from "glob";
import path from "path";

const entries = glob
   .sync("src/**/*.ts")
   .map((f) => f.split(path.sep).join("/"))
   .filter(
      (f) =>
         !f.endsWith("index.ts") &&
         !f.endsWith(".d.ts") &&
         !f.startsWith("src/utils/")
   );

export default defineConfig({
   entry: entries,
   format: ["esm"],
   dts: false,
   splitting: false,
   clean: true,
   outDir: "dist/raw",
   minify: false,
   bundle: true,
   esbuildPlugins: [removeCommentsPlugin()],
});

// remove comments
export function removeCommentsPlugin(): Plugin {
   return {
      name: "remove-comments",
      setup(build) {
         build.onLoad({ filter: /\.[tj]s$/ }, async (args) => {
            const fs = await import("fs/promises");
            let source = await fs.readFile(args.path, "utf8");

            // Remove // comments and /* block comments */
            source = source
               .replace(/\/\/.*$/gm, "") // remove single-line comments
               .replace(/\/\*[\s\S]*?\*\//g, ""); // remove block comments

            return {
               contents: source,
               loader: args.path.endsWith(".ts") ? "ts" : "js",
            };
         });
      },
   };
}
