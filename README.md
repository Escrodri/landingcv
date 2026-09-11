# Landing Page — Confección de Currículums

Landing page moderna y de alta conversión desarrollada para la oferta de servicios de diseño y redacción de currículums profesionales, con contacto directo e integración vía WhatsApp.

---

## Características

- **Diseño orientado a conversión:** Interfaz atractiva y optimizada para dispositivos móviles (mobile-first).
- **Segmentación por rubros:** Soporte de rutas dinámicas para campañas específicas según el área laboral del postulante.
- **Integración con WhatsApp:** Generación automática de mensajes personalizados y seguimiento de parámetros de referencia (`?ref=`).
- **Disponibilidad en tiempo real:** Detección automática del estado del servicio ("Atendiendo ahora" o próximo horario de apertura) según la hora local.
- **Rendimiento y SEO:** Carga ultrarrápida, metaetiquetas Open Graph completas, favicon multirresolución y soporte para Pixel de seguimiento.

---

## Tecnologías

- **Framework:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador y entorno:** [Vite](https://vite.dev/)
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

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con Vite. |
| `npm run build` | Valida tipos con TypeScript y compila la aplicación para producción en `dist/`. |
| `npm run preview` | Previsualiza localmente la versión de producción generada. |
| `npm run lint` | Analiza el código fuente con ESLint. |
| `npm run format` | Aplica formato al código con Prettier. |
| `npm run gen:assets` | Genera íconos y favicons en múltiples resoluciones desde los SVG fuente. |

---

## Estructura del Proyecto

```text
├── public/              # Favicons, manifest, imágenes sociales y estáticos
├── scripts/             # Herramientas para generación y optimización de assets
├── src/
│   ├── assets/          # Imágenes de ejemplos de CV, logos y recursos visuales
│   ├── pages/           # Vistas principales (Home, NotFound, etc.)
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

Toda la parametrización del negocio se gestiona de forma centralizada en `src/config.ts`:

- **Canal de atención:** Número y enlace directo para recepción de solicitudes vía WhatsApp.
- **Servicios y precios:** Catálogo de opciones de CV, detalles incluidos y extras disponibles.
- **Horarios de atención:** Franja horaria para el indicador dinámico de respuesta en la cabecera.
- **Métodos de pago:** Opciones y modalidades aceptadas.

---

## Despliegue

La aplicación es una Single Page Application (SPA). Al desplegar en plataformas como **Cloudflare Pages**, **Vercel** o **Netlify**:

1. Ejecutar el comando de construcción: `npm run build`
2. Configurar la carpeta de salida (output directory): `dist`
3. Asegurar la regla de reescritura (*rewrite*) para que todas las rutas apunten a `/index.html`.
