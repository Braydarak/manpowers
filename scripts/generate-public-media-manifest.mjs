import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const publicDir = path.join(rootDir, "public");
const outDir = path.join(rootDir, "src", "generated");
const outFile = path.join(outDir, "publicMediaManifest.ts");

const MEDIA_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".mp4",
  ".webm",
]);

const toPosix = (p) => p.split(path.sep).join("/");

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(abs)));
    } else if (entry.isFile()) {
      files.push(abs);
    }
  }
  return files;
};

const main = async () => {
  const allFiles = await walk(publicDir);
  const manifest = {};

  for (const abs of allFiles) {
    const ext = path.extname(abs).toLowerCase();
    if (!MEDIA_EXTENSIONS.has(ext)) continue;

    const rel = toPosix(path.relative(publicDir, abs));
    const dirRel = toPosix(path.dirname(rel));
    const key = dirRel === "." ? "" : dirRel;
    if (!manifest[key]) manifest[key] = [];
    manifest[key].push(rel);
  }

  for (const key of Object.keys(manifest)) {
    manifest[key].sort((a, b) => a.localeCompare(b));
  }

  const ordered = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );

  await fs.mkdir(outDir, { recursive: true });

  const contents = `export const PUBLIC_MEDIA_MANIFEST = ${JSON.stringify(
    ordered,
    null,
    2,
  )} as const;

export type PublicMediaManifest = typeof PUBLIC_MEDIA_MANIFEST;
`;

  await fs.writeFile(outFile, contents, "utf8");
};

main();
