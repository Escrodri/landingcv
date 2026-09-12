# Pixel de Meta — cv.pediloaqui.online

Pixel **978511738604905**, instalado y midiendo. Este documento explica qué mide
hoy, cómo comprobarlo y cómo cerrar después el circuito de las ventas.

---

## Qué se instaló

| Archivo              | Qué hace                                                                       |
| :------------------- | :----------------------------------------------------------------------------- |
| `index.html`         | Código base del Pixel. Dispara `PageView` al cargar. No se carga en localhost. |
| `src/pixel.ts`       | Eventos, ID del visitante y datos de coincidencia para la API de Conversiones. |
| `src/pages/Home.tsx` | Dispara los eventos en los botones y al ver los precios.                       |

---

## Eventos que manda el sitio

| Evento        | Cuándo se dispara                                                    | Para qué sirve                               |
| :------------ | :------------------------------------------------------------------- | :------------------------------------------- |
| `PageView`    | Cada vista, incluidas las rutas por rubro (`/repositor`, `/cajero`…) | Tráfico y público para remarketing           |
| `ViewContent` | La persona llegó a ver la sección de precios (40 % visible)          | Separa a quien miró en serio de quien rebotó |
| `Lead`        | Tocó cualquier botón de WhatsApp                                     | **Este es el que optimizan los anuncios**    |

`Lead` viaja con estos datos:

```js
{
  content_name: "CV Harvard a prueba de ATS",
  content_category: "harvard",
  value: 50000,
  currency: "PYG",
  boton: "precios-harvard",   // desde qué botón salió el clic
  rubro: "Repositor",         // de qué landing venía
  anuncio: "AN1",             // código ?ref= del anuncio
  vid: "K7F2QD"               // ID del visitante
}
```

El `value` es el precio del CV elegido, así Meta aprende a traer gente que
pide el Harvard (Gs. 50.000) y no solo el Clásico (Gs. 35.000).

El campo `boton` te dice qué parte de la página convierte: `hero`,
`ejemplo-repositor`, `precios-clasico`, `precios-harvard`, `banda-empezar`,
`cierre`, `flotante`.

---

## Cómo comprobar que funciona

1. Publicá el sitio (`npm run build` → `dist/`).
2. Instalá la extensión **Meta Pixel Helper** en Chrome.
3. Entrá a `https://cv.pediloaqui.online/repositor?ref=TEST`.
   El Helper tiene que mostrar `PageView`.
4. Bajá hasta los precios → aparece `ViewContent`.
5. Tocá un botón verde → aparece `Lead` con `value: 35000` y `currency: PYG`.
6. En el Administrador de eventos, pestaña **Probar eventos**: pegá la URL y
   repetí los pasos. Los eventos llegan en tiempo real.

En `localhost` el Pixel no carga a propósito: las pruebas locales no ensucian
los datos. Para probar de verdad hay que usar el dominio publicado.

---

## Cómo configurar el anuncio

- **Objetivo de la campaña:** Clientes potenciales (Leads).
- **Lugar de conversión:** Sitio web.
- **Evento de conversión:** `Lead`.
- **URL del anuncio:** la del rubro más el código, por ejemplo
  `https://cv.pediloaqui.online/repositor?ref=AN1`.

Un código `?ref=` distinto por anuncio. Ese código aparece después en el
mensaje de WhatsApp, así sabés qué anuncio trajo a cada persona sin depender
de los informes de Meta.

Antes de gastar mucho: dejá que junte 30–50 `Lead` por semana. Con menos que
eso el algoritmo no sale de la fase de aprendizaje.

---

## El código que viaja en el mensaje

Cada mensaje de WhatsApp termina con un código entre corchetes:

```
Hola, quiero mi CV Clásico de repositor (Gs. 35.000) 👋 [AN1·K7F2QD]
```

- `AN1` → el anuncio (`?ref=`).
- `K7F2QD` → el ID del visitante, guardado en su celular.

El ID es el mismo si la persona vuelve más tarde desde el mismo teléfono. Es la
pieza que permite unir la venta con el clic del anuncio.

---

## Lo que todavía no se puede medir (y cómo se arregla)

Hoy Meta sabe **quién tocó el botón**, no **quién pagó**. La venta se cierra en
WhatsApp, fuera del navegador, así que el Pixel no la ve.

Para cerrar el circuito hacen falta tres piezas, en este orden:

**1. Guardar el clic en el backend.** Al tocar el botón, el sitio manda a la
API los datos de coincidencia que ya calcula `datosDeCoincidencia()` en
`src/pixel.ts`: `external_id` (el ID del visitante), las cookies `_fbp` y
`_fbc`, y la URL. Se guardan con el ID del visitante como clave.

```ts
// en el onClick, junto a lead(...)
fetch(`${API}/track/click`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(datosDeCoincidencia()),
  keepalive: true,
});
```

**2. Que el bot lea el código.** El primer mensaje del cliente trae
`[AN1·K7F2QD]`. El bot lo extrae con una expresión regular y lo guarda junto al
estado del cliente. Así cada conversación queda atada a su clic.

**3. Mandar la venta por la API de Conversiones.** Cuando se confirma la seña,
el backend le manda a Meta un `Purchase` con `external_id`, `fbp` y `fbc` de ese
visitante, más el monto real. Ahí Meta une la venta con el anuncio y empieza a
optimizar por gente que paga, no por gente que toca el botón.

Para el paso 3 hace falta un **token de acceso** de la API de Conversiones
(Administrador de eventos → Configuración → API de conversiones → Generar
token). Va en el `.env` del backend, nunca en el sitio.

---

## Orden recomendado

1. Publicar el sitio con el Pixel y verificar con el Helper. ← **ya está listo**
2. Verificar el dominio en Meta Business (Configuración del negocio → Dominios).
3. Lanzar la campaña optimizando `Lead`.
4. Con datos reales de una o dos semanas, recién ahí armar la API de
   Conversiones para el `Purchase`.

Saltar al paso 4 antes de tener volumen no sirve: sin ventas suficientes Meta
no puede aprender de ellas.
