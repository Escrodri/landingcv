# pediloaquí — tucv.pediloaqui.online

Página de venta de currículums por WhatsApp para tráfico de Meta Ads (Paraguay).
Público: gente que busca empleo ya y no tiene compu o no sabe redactar.
Promesa: **CV en menos de 2 horas, desde Gs. 35.000.** Cobro: **seña del 50 % para empezar, el resto al recibir el PDF**.
Tipos de CV (pago único, nunca "plan"): CV Clásico Gs. 35.000 · CV Harvard a prueba de ATS Gs. 50.000 · Nota de presentación +Gs. 15.000.

**React 19 + TypeScript + Vite + Tailwind CSS v4** — SPA, sin SSR.

## Desarrollo

```sh
npm install
npm run dev      # http://localhost:5173
npm run format   # formatear antes de subir
npm run build    # genera dist/
```

## Configuración (lo que más vas a tocar)

`src/config.ts`:

- `WHATSAPP_NUMBER` — tu número real (ej: `595981123456`)
- `TIPOS_CV` (nombre, precio, qué incluye), `NOTA` (extra), `ENTREGA`, `HORARIO`, `PAGOS`, `sena()` (cálculo de la mitad)

El encabezado muestra "Atendiendo ahora" o "Respondemos desde las 8:00" según la hora de Paraguay.

## Rubros y anuncios

`src/campanias.ts` — un titular por rubro. Cada anuncio apunta a su URL:

`/` · `/repositor` · `/cajero` · `/chofer` · `/guardia` · `/primer-empleo` · `/encargado`

Agregá `?ref=CODIGO` a la URL del anuncio: el código viaja en el mensaje de WhatsApp.
Un rubro desconocido muestra la versión general (no se pierde tráfico por un error de tipeo).

## Marketing

- `marketing/CAMPANAS.md` — textos de anuncios, URLs, qué medir
- `marketing/WHATSAPP.md` — bienvenida, respuestas rápidas y etiquetas para atender rápido
- `marketing/*.png` — creativos listos (feed 1080×1080, historia 1080×1920, uno por rubro)
- `marketing/tarjeta-precios-whatsapp.png` — tarjeta de precios para respuestas rápidas, estado y catálogo

## Pixel de Meta

Pegá el código base del Pixel en `index.html` (hay un comentario marcando el lugar).
Los botones de WhatsApp ya disparan el evento `Contact`. Optimizá las campañas por ese evento.

## Identidad

- Isotipo: cursor con destellos de clic, negro sobre amarillo `#FFC83D`
- Botones: verde WhatsApp `#25D366` con texto oscuro `#062B1B` (el blanco no se lee)
- Texto: azul marino `#1B2530` · Fuente: Poppins
- `public/favicon.svg` es la fuente del ícono → `npm run gen:assets` regenera PNG e ICO

## Archivos viejos que se pueden borrar

Ya no se usan: `src/assets/cv-harvard.jpg`, `cv-moderno.jpg`, `cv-ejecutivo.jpg`, `scripts/og-image.svg`.

## Deploy

`npm run build` → subir `dist/` a Netlify, Vercel o Cloudflare Pages.
SPA: configurá el rewrite de todas las rutas a `/index.html`.
Apuntá `tucv.pediloaqui.online` (CNAME) al hosting.
Después de publicar, pasá la URL por el [Depurador de Facebook](https://developers.facebook.com/tools/debug/).
