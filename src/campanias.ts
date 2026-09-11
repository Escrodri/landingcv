// ============================================================
// RUBROS Y CAMPAÑAS
// Cada anuncio apunta a la URL de su rubro:
//   cv.pediloaqui.online/                → general
//   cv.pediloaqui.online/repositor
//   cv.pediloaqui.online/cajero
//   cv.pediloaqui.online/chofer
//   cv.pediloaqui.online/guardia
//   cv.pediloaqui.online/primer-empleo
//   cv.pediloaqui.online/encargado
//
// Opcional: agregá ?ref=AN1 a la URL del anuncio. El código viaja en el
// mensaje de WhatsApp y así sabés qué anuncio te trajo cada cliente.
// ============================================================

import cvCajera from "@/assets/ejemplos/cv-cajera.jpg";
import cvChofer from "@/assets/ejemplos/cv-chofer.jpg";
import cvEncargado from "@/assets/ejemplos/cv-encargado.jpg";
import cvGuardia from "@/assets/ejemplos/cv-guardia.jpg";
import cvHarvardAdmin from "@/assets/ejemplos/cv-harvard-administracion.jpg";
import cvHarvardEncargado from "@/assets/ejemplos/cv-harvard-encargado.jpg";
import cvPrimerEmpleo from "@/assets/ejemplos/cv-primer-empleo.jpg";
import cvRepositor from "@/assets/ejemplos/cv-repositor.jpg";

import type { TipoCV } from "@/config";

export type Rubro = {
  slug: string;
  /** Nombre corto que se muestra en la tarjeta de ejemplo. */
  nombre: string;
  img: string;
  /** Titular del hero cuando la persona llega desde el anuncio de este rubro. */
  gancho: string;
};

export const GANCHO_GENERAL = "¿Viste una vacancia y no tenés currículum?";

export const RUBROS: Rubro[] = [
  {
    slug: "repositor",
    nombre: "Repositor",
    img: cvRepositor,
    gancho: "¿Buscás trabajo de repositor y no tenés currículum?",
  },
  {
    slug: "cajero",
    nombre: "Cajero/a",
    img: cvCajera,
    gancho: "¿Buscás trabajo de cajero/a y no tenés currículum?",
  },
  {
    slug: "chofer",
    nombre: "Chofer",
    img: cvChofer,
    gancho: "¿Buscás trabajo de chofer y no tenés currículum?",
  },
  {
    slug: "guardia",
    nombre: "Guardia",
    img: cvGuardia,
    gancho: "¿Buscás trabajo de guardia y no tenés currículum?",
  },
  {
    slug: "primer-empleo",
    nombre: "Primer empleo",
    img: cvPrimerEmpleo,
    gancho: "¿Primer empleo y no sabés qué poner en el currículum?",
  },
  {
    slug: "encargado",
    nombre: "Encargado",
    img: cvEncargado,
    gancho: "¿Vas por un puesto de encargado y tu currículum no está a la altura?",
  },
];

/** Ejemplos que se muestran en "Mirá cómo queda", cada uno con su tipo (y precio). */
export type Ejemplo = { key: string; titulo: string; img: string; tipo: TipoCV["id"] };

export const EJEMPLOS_HARVARD: Ejemplo[] = [
  { key: "harvard-admin", titulo: "Administración", img: cvHarvardAdmin, tipo: "harvard" },
  { key: "harvard-encargado", titulo: "Encargado", img: cvHarvardEncargado, tipo: "harvard" },
];

export const buscarRubro = (slug: string | undefined) =>
  slug ? RUBROS.find((r) => r.slug === slug) : undefined;
