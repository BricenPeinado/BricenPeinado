import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js", "resume.pdf"]) {
  await cp(join(root, file), join(client, file));
}

await cp(join(root, "assets"), join(client, "assets"), { recursive: true });
await cp(join(root, "worker", "index.js"), join(server, "index.js"));

console.log("Built static portfolio for Sites.");
