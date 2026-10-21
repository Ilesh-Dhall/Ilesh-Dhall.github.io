// Creates resized WebP copies of project and paper images next to the originals.
// Usage: npm run optimize-images [-- --force]
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIRS = ['public/projects', 'public/papers'];
const SOURCE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
// Twice the widest content column (768px), so images stay sharp on high-DPI screens.
const MAX_WIDTH = 1600;
const QUALITY = 82;

const force = process.argv.includes('--force');

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listImages(fullPath);
    return SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  });
}

function formatKB(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

let converted = 0;
let skipped = 0;

for (const source of SOURCE_DIRS.flatMap(listImages)) {
  const target = source.replace(/\.[^.]+$/, '.webp');

  if (!force && fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs) {
    skipped++;
    continue;
  }

  // sharp drops EXIF/GPS metadata unless asked to keep it.
  await sharp(source)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(target);

  converted++;
  console.log(`${source}: ${formatKB(fs.statSync(source).size)} -> ${formatKB(fs.statSync(target).size)}`);
}

console.log(`Converted ${converted}, skipped ${skipped} up-to-date image(s).`);
