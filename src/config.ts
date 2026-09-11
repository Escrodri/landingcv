// ============================================================
// CONFIGURACIÓN DEL NEGOCIO — todo lo que cambia seguido está acá.
// ============================================================

/** Número de WhatsApp, formato internacional sin "+" ni espacios (ej: 595981123456). */
export const WHATSAPP_NUMBER = "595984177265";

export const DOMINIO = "cv.pediloaqui.online";

/** Tiempo de entrega que se promete (CV Clásico). */
export const ENTREGA = "menos de 2 horas";

/** Formatea guaraníes: 35000 → "Gs. 35.000" */
export const gs = (monto: number) => `Gs. ${monto.toLocaleString("es-PY").replace(/,/g, ".")}`;

export type TipoCV = {
  id: "clasico" | "harvard";
  nombre: string;
  /** Sello chico al lado del nombre (ej: "A prueba de ATS"). */
  sello?: string;
  precio: number;
  /** Para qué tipo de trabajos sirve. */
  para: string;
  /** Una línea corta para la tarjeta de precios (para y tiempo de entrega). */
  resumen: string;
  incluye: string[];
  destacado?: boolean;
};

/**
 * Tipos de CV. Pago único (NO es mensualidad: nunca usar la palabra "plan").
 * El primero es el precio de entrada y tiene que coincidir con el anuncio.
 */
export const TIPOS_CV: TipoCV[] = [
  {
    id: "clasico",
    nombre: "CV Clásico",
    precio: 35000,
    para: "Supermercados, tiendas, seguridad, transporte, fábricas y primer empleo.",
    resumen: `Supermercados, tiendas, seguridad, transporte. Listo en ${ENTREGA}.`,
    incluye: [
      "PDF listo para imprimir o enviar",
      "Imagen del CV para mandar por WhatsApp",
      "Con foto o sin foto",
      "1 corrección gratis",
      `Listo en ${ENTREGA}`,
    ],
  },
  {
    id: "harvard",
    nombre: "CV Harvard",
    sello: "A prueba de ATS",
    precio: 50000,
    para: "Bancos, empresas grandes, oficinas y portales como Computrabajo o LinkedIn.",
    resumen: "Bancos, empresas grandes, Computrabajo, LinkedIn. PDF + Word · en 1 hora.",
    destacado: true,
    incluye: [
      "Formato Harvard: sobrio, ordenado, estándar internacional",
      "Hecho para los filtros automáticos (ATS): texto limpio, sin tablas ni dibujos",
      "Perfil y logros redactados para el puesto",
      "PDF + Word para editar después",
      "3 correcciones gratis (hasta 7 días)",
      "Listo en 1 hora",
    ],
  },
];

/** Extra que se puede sumar a cualquier tipo de CV. */
export const NOTA = {
  nombre: "Nota de presentación",
  precio: 15000,
  descripcion: "Una carta corta para la empresa, hecha para el puesto. Muchas la piden junto al CV.",
};

/**
 * Seña: se paga la mitad para empezar y la otra mitad al recibir el PDF.
 * Nunca se arranca un CV sin seña (evita trabajar gratis).
 */
export const sena = (monto: number) => Math.ceil(monto / 2 / 500) * 500;
export const COMO_SE_PAGA = "Mitad para empezar, mitad al recibir";

/** Precio de entrada que se muestra arriba y en los anuncios. */
export const PRECIO = gs(TIPOS_CV[0]?.precio ?? 35000);

export const tipoPorId = (id: TipoCV["id"]) => TIPOS_CV.find((t) => t.id === id) ?? TIPOS_CV[0]!;

/** Horario de atención (hora de Paraguay). 0 = domingo … 6 = sábado. */
export const HORARIO = {
  dias: [1, 2, 3, 4, 5, 6],
  desde: 8,
  hasta: 20,
  /** Pedidos después de esta hora salen a primera hora del día siguiente. */
  corte: 18,
  texto: "Lunes a sábado, de 8:00 a 20:00",
};

export const PAGOS = ["Giros Tigo", "Billetera Personal", "Transferencia bancaria"];

export const wa = (texto: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

/** true si ahora mismo (hora de Paraguay) estamos dentro del horario de atención. */
export function atendiendoAhora(fecha = new Date()): boolean {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Asuncion",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const dias = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dia = dias.indexOf(partes.find((p) => p.type === "weekday")?.value ?? "");
  const hora = Number(partes.find((p) => p.type === "hour")?.value ?? -1);
  return HORARIO.dias.includes(dia) && hora >= HORARIO.desde && hora < HORARIO.hasta;
}
