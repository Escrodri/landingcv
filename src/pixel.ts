// ============================================================
// PIXEL DE META — capa fina sobre fbq.
//
// El código base del Pixel vive en index.html (se carga primero y dispara
// PageView). Acá va todo lo demás: eventos, identificación del visitante y
// el código corto que viaja en el mensaje de WhatsApp.
//
// Eventos que manda el sitio:
//   PageView     → cada vista, incluidas las rutas por rubro (/repositor…)
//   ViewContent  → la persona llegó a ver los precios (interés real)
//   Lead         → tocó un botón de WhatsApp  ← este se optimiza en los anuncios
//
// Lo que todavía NO puede saber el Pixel: quién pagó. Eso se cierra después
// con la API de Conversiones desde el bot (ver PIXEL.md).
// ============================================================

export const PIXEL_ID = "978511738604905";

type Fbq = (...args: unknown[]) => void;
type FbqWindow = Window & { fbq?: Fbq };

const CLAVE_VID = "pa_vid";
const MONEDA = "PYG";

/** El Pixel cargó (en localhost se deja un fbq vacío a propósito). */
function fbq(): Fbq | undefined {
  if (typeof window === "undefined") return undefined;
  const f = (window as FbqWindow).fbq;
  return typeof f === "function" ? f : undefined;
}

// ---------- Identificación del visitante ----------

/** Código corto, fácil de leer y de copiar en un chat: 6 caracteres sin vocales confusas. */
function nuevoCodigo(): string {
  const alfabeto = "ACDEFGHJKLMNPQRTUVWXY34679";
  let out = "";
  const bytes = new Uint8Array(6);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 6; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < 6; i += 1) out += alfabeto[bytes[i]! % alfabeto.length];
  return out;
}

let vidMemoria: string | null = null;

/**
 * ID del visitante: el mismo código durante toda su visita (y las que vuelva
 * a hacer desde el mismo celular). Viaja en el mensaje de WhatsApp y se manda
 * a Meta como `external_id`, así el día que se mande la venta por la API de
 * Conversiones, Meta la puede unir con el clic del anuncio.
 */
export function visitanteId(): string {
  if (vidMemoria) return vidMemoria;
  try {
    const guardado = localStorage.getItem(CLAVE_VID);
    if (guardado) {
      vidMemoria = guardado;
      return guardado;
    }
    const nuevo = nuevoCodigo();
    localStorage.setItem(CLAVE_VID, nuevo);
    vidMemoria = nuevo;
    return nuevo;
  } catch {
    // Navegador sin almacenamiento (modo privado, cookies bloqueadas): igual
    // sirve dentro de la misma vista.
    vidMemoria = vidMemoria ?? nuevoCodigo();
    return vidMemoria;
  }
}

function cookie(nombre: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${nombre}=([^;]*)`));
  return m ? decodeURIComponent(m[1]!) : undefined;
}

/**
 * Datos de coincidencia que necesita la API de Conversiones para juntar la
 * venta con el clic. Sirve para mandarlos al backend cuando exista el endpoint.
 */
export function datosDeCoincidencia() {
  return {
    external_id: visitanteId(),
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc"),
    url: typeof location !== "undefined" ? location.href : undefined,
  };
}

// ---------- Eventos ----------

type Params = Record<string, unknown>;

/** Evento estándar de Meta. Si el Pixel no cargó, no pasa nada. */
export function track(evento: string, params?: Params, eventID?: string): void {
  const f = fbq();
  if (!f) return;
  if (eventID) {
    f("track", evento, params ?? {}, { eventID });
  } else if (params) {
    f("track", evento, params);
  } else {
    f("track", evento);
  }
}

/** Evento propio (no estándar de Meta). Sirve para mirar detalle en informes. */
export function trackCustom(evento: string, params?: Params): void {
  const f = fbq();
  if (!f) return;
  if (params) {
    f("trackCustom", evento, params);
  } else {
    f("trackCustom", evento);
  }
}

/** PageView manual: las rutas por rubro no recargan la página. */
export function pageView(): void {
  track("PageView");
}

/** La persona llegó a ver los precios. */
export function viewContent(datos: { rubro?: string | undefined }): void {
  track("ViewContent", {
    content_name: "precios",
    content_category: datos.rubro ?? "general",
    currency: MONEDA,
  });
}

/**
 * Tocó un botón de WhatsApp. Es el evento que se usa para optimizar los
 * anuncios: cada uno vale lo que sale el CV que eligió.
 */
export function lead(datos: {
  tipo: string;
  nombre: string;
  valor: number;
  donde: string;
  rubro?: string | undefined;
  ref?: string | null | undefined;
}): void {
  track(
    "Lead",
    {
      content_name: datos.nombre,
      content_category: datos.tipo,
      content_ids: [datos.tipo],
      value: datos.valor,
      currency: MONEDA,
      // Para leer los informes: desde qué botón y desde qué anuncio salió.
      boton: datos.donde,
      rubro: datos.rubro ?? "general",
      anuncio: datos.ref ?? "directo",
      vid: visitanteId(),
    },
    // event_id: si el mismo clic llega dos veces, Meta lo cuenta una sola.
    `lead-${visitanteId()}-${Date.now()}`,
  );
}
