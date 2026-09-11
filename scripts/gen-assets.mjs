// Genera los íconos rasterizados a partir de los SVG fuente.
//   node scripts/gen-assets.mjs
// Requiere: sharp, png-to-ico (devDependencies)
//
// La imagen para compartir (public/og-image.png) y los anuncios de
// marketing/ son PNG finales: no se regeneran desde acá.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

const faviconSvg = await readFile(join(pub, "favicon.svg"));
const maskableSvg = await readFile(join(root, "scripts", "icon-maskable.svg"));
// iOS recorta las esquinas solo: el apple-touch-icon va a sangre, sin bordes redondeados.
const appleSvg = await readFile(join(root, "scripts", "icon-cuadrado.svg"));

// --- Favicons PNG (apple-touch-icon y manifest) ---
const pngSizes = [
  { src: appleSvg, size: 180, name: "apple-touch-icon.png" },
  { src: faviconSvg, size: 192, name: "icon-192.png" },
  { src: faviconSvg, size: 512, name: "icon-512.png" },
  { src: maskableSvg, size: 512, name: "icon-maskable-512.png" },
];
for (const { src, size, name } of pngSizes) {
  await sharp(src, { density: 1536 }).resize(size, size).png().toFile(join(pub, name));
  console.log("✓", name);
}

// --- favicon.ico multi-resolución (16/32/48) ---
const icoBuffers = await Promise.all(
  [16, 32, 48].map((s) => sharp(faviconSvg, { density: 384 }).resize(s, s).png().toBuffer()),
);
await writeFile(join(pub, "favicon.ico"), await pngToIco(icoBuffers));
console.log("✓ favicon.ico");
