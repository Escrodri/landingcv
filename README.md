# Landing Page — Confección de Currículums

Landing page moderna y de alta conversión para la oferta de servicios de diseño y redacción de currículums profesionales, con contacto directo e integración vía WhatsApp.

---

## Características

- **Diseño orientado a conversión:** Interfaz responsive optimizada para dispositivos móviles (mobile-first).
- **Segmentación por rubros:** Rutas dinámicas dedicadas para anuncios según el área laboral del postulante.
- **Integración con WhatsApp:** Generación automática de mensajes personalizados y seguimiento de parámetros de referencia (`?ref=`).
- **Disponibilidad en tiempo real:** Detección automática del estado de atención según la hora local.
- **Optimización para compartir (Open Graph):** Imagen de vista previa y metadatos optimizados para WhatsApp y redes sociales.
- **Rendimiento:** Carga rápida construida como SPA con Vite y React 19.

---

## Tecnologías

- **Framework:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador:** [Vite](https://vite.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Enrutamiento:** [React Router](https://reactrouter.com/)

---

## Comenzando

### Requisitos previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- npm, pnpm o yarn

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Escrodri/landingcv.git
   cd landingcv
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el entorno de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

---

## Scripts Disponibles

| Comando              | Descripción                                                                     |
| :------------------- | :------------------------------------------------------------------------------ |
| `npm run dev`        | Inicia el servidor de desarrollo local con Vite.                                |
| `npm run build`      | Valida tipos con TypeScript y compila la aplicación para producción en `dist/`. |
| `npm run preview`    | Previsualiza localmente la versión de producción generada.                      |
| `npm run lint`       | Analiza el código fuente con ESLint.                                            |
| `npm run format`     | Aplica formato al código con Prettier.                                          |
| `npm run gen:assets` | Genera íconos y favicons en múltiples resoluciones desde los SVG fuente.        |

---

## Estructura del Proyecto

```text
├── public/              # Favicons, manifest, imágenes sociales (og-cv.jpg) y estáticos
├── scripts/             # Herramientas para generación y optimización de assets
├── src/
│   ├── assets/          # Imágenes de ejemplos de CV, logos y recursos visuales
│   ├── pages/           # Vistas principales (Home, NotFound)
│   ├── campanias.ts     # Configuración de titulares y textos por cada rubro
│   ├── config.ts        # Datos del servicio (contacto, precios, horarios, entregas)
│   ├── styles.css       # Configuración global y tokens de estilo
│   ├── App.tsx          # Definición de rutas de la aplicación
│   └── main.tsx         # Punto de entrada de la aplicación
├── index.html           # Plantilla HTML principal
└── vite.config.ts       # Configuración de Vite y plugins
```

---

## Configuración del Servicio

La parametrización del negocio se gestiona de forma centralizada en `src/config.ts`:

- **Canal de atención:** Número y enlaces directos de WhatsApp.
- **Dominio:** Configuración del dominio de producción (`cv.pediloaqui.online`).
- **Servicios y precios:** Opciones de currículum, servicios adicionales y condiciones.
- **Horarios de atención:** Franja horaria para el indicador dinámico de cabecera.
- **Métodos de pago:** Opciones y modalidades aceptadas.

---

## Medición (Pixel de Meta)

Pixel `1818002972544952` instalado. El código base está en `index.html` y los
eventos en `src/pixel.ts`:

| Evento        | Cuándo                                                         |
| :------------ | :------------------------------------------------------------- |
| `PageView`    | Cada vista, incluidas las rutas por rubro                      |
| `ViewContent` | La persona llegó a la sección de precios                       |
| `Lead`        | Tocó un botón de WhatsApp (evento a optimizar en los anuncios) |

En `localhost` el Pixel no se carga, para no ensuciar el Administrador de
eventos. Detalle completo, verificación y siguientes pasos en [`PIXEL.md`](./PIXEL.md).

---

## Vista Previa al Compartir (Open Graph)

La imagen social para WhatsApp y redes se ubica en `public/og-cv.jpg` (1200×630 píxeles, optimizada para rápida previsualización).

Las etiquetas Open Graph en `index.html` están configuradas para el dominio de producción (`https://cv.pediloaqui.online/`). Tras publicar o actualizar:

1. Validar la URL en el depurador de Facebook/Meta para refrescar la caché.
2. Si WhatsApp conserva en caché la vista previa anterior, puede probarse compartiendo con un parámetro de versión (ej. `?v=2`).

---

## Despliegue

La aplicación es una Single Page Application (SPA):

1. Ejecutar la compilación: `npm run build`
2. Carpeta de publicación (output directory): `dist`
3. Configurar la regla de reescritura (_rewrite_) para que todas las rutas se dirijan a `/index.html`.
