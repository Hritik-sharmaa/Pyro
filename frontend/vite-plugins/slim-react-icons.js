// Build-time memory saver for `react-icons`.
//
// Each react-icons pack (md, fa, ai, ...) is ONE multi-megabyte ES module that
// declares thousands of icons. Rollup has to parse every pack you import from in
// full, even if you use two icons - Pyro imports from 14 packs, which pushes
// `vite build` past 768 MB of heap and gets it killed on 512 MB hosts
// (e.g. Render's free tier).
//
// This plugin rewrites
//     import { MdEmail, MdLock as Lock } from "react-icons/md";
// into an import of a tiny virtual module that contains only those icon
// definitions, copied verbatim from the pack. Output is identical; the build is
// just far lighter. Source files are not modified on disk.
//
// It only runs for `vite build`; the dev server is unaffected.
// If an icon can't be found in its pack, the build fails with a clear message.

const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*["']react-icons\/([a-z0-9]+)["']\s*;?/g;
const PREFIX = "slim-react-icons:";

export default function slimReactIcons() {
  return {
    name: "slim-react-icons",
    apply: "build",
    enforce: "pre",

    transform(code, id) {
      const file = id.split("?")[0];
      if (file.includes("node_modules")) return null;
      if (!/\.[jt]sx?$/.test(file) || !code.includes("react-icons/")) return null;

      let changed = false;
      const out = code.replace(IMPORT_RE, (_match, specifiers, pack) => {
        const specs = specifiers.split(",").map((s) => s.trim()).filter(Boolean);
        const names = specs.map((s) => s.split(/\s+as\s+/)[0].trim());
        changed = true;
        return `import { ${specs.join(", ")} } from "${PREFIX}${pack}:${names.join(",")}";`;
      });

      return changed ? { code: out, map: null } : null;
    },

    resolveId(id) {
      return id.startsWith(PREFIX) ? `\0${id}` : null;
    },

    async load(id) {
      if (!id.startsWith(`\0${PREFIX}`)) return null;

      const [pack, namesCsv] = id.slice(PREFIX.length + 1).split(":");
      const names = namesCsv.split(",");

      const resolved = await this.resolve(`react-icons/${pack}`, undefined, {
        skipSelf: true,
      });
      if (!resolved) this.error(`slim-react-icons: cannot resolve react-icons/${pack}`);

      const { readFileSync } = await import("node:fs");
      const source = readFileSync(resolved.id.split("?")[0], "utf8");

      const blocks = names.map((name) => {
        const re = new RegExp(`export function ${name} \\(props\\) \\{[\\s\\S]*?\\n\\};`);
        const match = source.match(re);
        if (!match) {
          this.error(
            `slim-react-icons: icon "${name}" was not found in react-icons/${pack}. ` +
              "Check the icon name, or remove the slim-react-icons plugin from vite.config.js."
          );
        }
        return match[0];
      });

      return `import { GenIcon } from "react-icons/lib";\n${blocks.join("\n")}\n`;
    },
  };
}
