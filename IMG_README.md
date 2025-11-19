Generar imágenes responsive y WebP
=================================

Instrucciones rápidas

1. Instala dependencias (en la carpeta del proyecto):

```bash
npm init -y
npm install sharp
```

2. Ejecuta el script para generar tamaños y WebP:

```bash
node scripts/generate-resp-images.js
```

3. El script creará `IMAGENES/responsive/` con archivos con sufijos `-320`, `-640`, `-1024`, `-1600` y sus versiones `.webp`.

Uso en HTML

Reemplaza una etiqueta `<img src="IMAGENES/limon.png">` por un bloque `<picture>` así:

```html
<picture>
  <source type="image/webp" srcset="IMAGENES/responsive/limon-320.webp 320w, IMAGENES/responsive/limon-640.webp 640w, IMAGENES/responsive/limon-1024.webp 1024w" sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw">
  <img src="IMAGENES/responsive/limon-640.jpg" srcset="IMAGENES/responsive/limon-320.jpg 320w, IMAGENES/responsive/limon-640.jpg 640w, IMAGENES/responsive/limon-1024.jpg 1024w" sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw" alt="Limones" loading="lazy" class="responsive-img">
</picture>
```

Notas
- Ajusta las rutas/nombres según tus archivos originales.
- `sizes` indica al navegador qué ancho aproximado ocupará la imagen según breakpoints; cámbialo según tu diseño.
- Si quieres, puedo automatizar la sustitución en `index.html` si confirmas el patrón de nombres.
