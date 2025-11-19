#!/usr/bin/env node
/**
 * Script simple para generar versiones responsivas y WebP de las imágenes
 * Usa: npm install sharp
 * Luego: node scripts/generate-resp-images.js
 * Salida: carpeta `IMAGENES/responsive/` con archivos {name}-{width}.{ext} y .webp
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const inputDir = path.join(projectRoot, 'IMAGENES');
const outDir = path.join(inputDir, 'responsive');
const sizes = [320, 640, 1024, 1600];

if (!fs.existsSync(inputDir)) {
  console.error('No existe la carpeta IMAGENES. Coloca tus imágenes en /IMAGENES y vuelve a ejecutar.');
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => {
  const ext = path.extname(f).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
});

if (files.length === 0) {
  console.log('No se encontraron imágenes en /IMAGENES');
  process.exit(0);
}

async function processFile(file) {
  const ext = path.extname(file);
  const name = path.basename(file, ext);
  const inputPath = path.join(inputDir, file);

  for (const w of sizes) {
    const outPath = path.join(outDir, `${name}-${w}${ext}`);
    try {
      await sharp(inputPath)
        .resize({ width: w })
        .toFile(outPath);
      console.log('Creado:', outPath);
    } catch (err) {
      console.error('Error creando', outPath, err.message);
    }

    // WebP
    const outWebp = path.join(outDir, `${name}-${w}.webp`);
    try {
      await sharp(inputPath)
        .resize({ width: w })
        .webp({ quality: 80 })
        .toFile(outWebp);
      console.log('Creado:', outWebp);
    } catch (err) {
      console.error('Error creando', outWebp, err.message);
    }
  }
}

(async () => {
  for (const f of files) {
    await processFile(f);
  }
  console.log('Proceso completado. Revisa la carpeta IMAGENES/responsive/');
})();
