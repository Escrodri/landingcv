import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import vistaPrevia from "@/assets/ejemplos/cv-repositor-preview.jpg";
import hero from "@/assets/hero-tucv.webp";
import logo from "@/assets/logo.svg";
import { buscarRubro, EJEMPLOS_HARVARD, GANCHO_GENERAL, RUBROS, type Ejemplo } from "@/campanias";
import {
  atendiendoAhora,
  DOMINIO,
  ENTREGA,
  gs,
  HORARIO,
  NOTA,
  COMO_SE_PAGA,
  PAGOS,
  PRECIO,
  sena,
  tipoPorId,
  TIPOS_CV,
  wa,
  type TipoCV,
} from "@/config";

/** Minúscula solo en la primera letra (no rompe siglas como ATS ni nombres propios). */
const minus = (s: string) => `${s.charAt(0).toLowerCase()}${s.slice(1)}`;

/** "CV Harvard a prueba de ATS" */
const nombreCompleto = (t: TipoCV) => (t.sello ? `${t.nombre} ${minus(t.sello)}` : t.nombre);

const CLASICO = tipoPorId("clasico");
const HARVARD = tipoPorId("harvard");

const PASOS = [
  {
    t: "Tocás el botón verde",
    d: "Se abre WhatsApp con el mensaje listo. Solo lo enviás.",
  },
  {
    t: "Nos contás tus datos y pagás la seña",
    d: `Tu nombre, dónde trabajaste y qué estudiaste. Con la seña (la mitad: ${gs(sena(CLASICO.precio))}) arrancamos al toque.`,
  },
  {
    t: "Ves tu CV, pagás el resto y listo",
    d: `Te mandamos cómo quedó. Pagás la otra mitad y recibís el PDF. Todo en ${ENTREGA}.`,
  },
];

const FAQ = [
  {
    q: "¿Cuánto cuesta?",
    a: `${CLASICO.nombre}: ${gs(CLASICO.precio)}. ${nombreCompleto(HARVARD)}: ${gs(HARVARD.precio)}. ${NOTA.nombre}: +${gs(NOTA.precio)}.`,
  },
  {
    q: "¿Tengo que pagar todos los meses?",
    a: "No. Pagás una sola vez y el CV es tuyo para siempre. No es mensualidad ni suscripción.",
  },
  {
    q: "¿Cuándo y cómo pago?",
    a: `La mitad (seña) para empezar y la otra mitad cuando ves tu CV terminado. CV Clásico: ${gs(sena(CLASICO.precio))} + ${gs(CLASICO.precio - sena(CLASICO.precio))}. CV Harvard: ${gs(sena(HARVARD.precio))} + ${gs(HARVARD.precio - sena(HARVARD.precio))}. Por ${PAGOS.join(", ").toLowerCase()}.`,
  },
  {
    q: "¿Por qué piden seña?",
    a: "Porque tu CV se hace a medida apenas nos pasás los datos. Con la seña reservás tu lugar y lo empezamos al toque. El resto lo pagás cuando ves que quedó bien.",
  },
  {
    q: "¿Y si algo no me gusta?",
    a: "Lo corregimos antes de que pagues el resto. Además tenés correcciones gratis después de recibirlo (1 en el Clásico, 3 en el Harvard).",
  },
  {
    q: "¿Cuánto tarda?",
    a: `${CLASICO.nombre}: ${ENTREGA}. ${HARVARD.nombre}: 1 hora. Atendemos ${HORARIO.texto.toLowerCase()}. Si escribís después de las ${HORARIO.corte}:00, lo tenés a primera hora del día siguiente.`,
  },
  {
    q: "¿Qué datos tengo que mandar?",
    a: "Tu nombre y cédula, teléfono y ciudad, dónde trabajaste y cuánto tiempo (changas también cuentan) y hasta qué año estudiaste. Si querés CV con foto, una foto tuya con fondo claro. Como te salga: nosotros lo ordenamos.",
  },
  {
    q: "¿Cuál me conviene?",
    a: `${CLASICO.nombre}: ${minus(CLASICO.para)} ${HARVARD.nombre}: ${minus(HARVARD.para)}`,
  },
  {
    q: "¿Qué es eso de ATS?",
    a: "Muchas empresas grandes usan un programa que lee los CV antes que una persona. Si el CV tiene tablas, columnas o dibujos, el programa puede no entenderlo y dejarlo afuera. El CV Harvard está hecho con texto limpio para que se lea bien.",
  },
  {
    q: "No tengo experiencia, ¿igual me sirve?",
    a: "Sí. Ponemos tus estudios, cursos, changas y lo que sabés hacer. Un CV ordenado hace la diferencia justamente cuando recién empezás.",
  },
  {
    q: "No tengo computadora, ¿cómo lo imprimo?",
    a: "Te mandamos el PDF por WhatsApp. Lo llevás en el celular a cualquier librería o cyber y lo imprimís. También lo podés enviar directo desde tu celular.",
  },
  {
    q: "¿Y si hay un dato mal?",
    a: "Tenés correcciones gratis (1 en el Clásico, 3 en el Harvard). Nos avisás y lo arreglamos.",
  },
];

// ---------- Íconos ----------

function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} flex-none fill-current`}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function Check({ className = "text-wa-dark" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`mt-0.5 h-5 w-5 flex-none fill-none stroke-current ${className}`}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

const ICONOS_PASOS: ReactNode[] = [
  // dedo tocando
  <path key="a" d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.7-2.3L4.5 15.3a1.6 1.6 0 0 1 2.4-2.1L9 15" />,
  // globo de chat
  <path key="b" d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12ZM8.5 10.5h7m-7 3.5h4.5" />,
  // documento con check
  <path key="c" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5M9 14.5l2 2 4-4.5" />,
];

type FbqWindow = Window & { fbq?: (...args: unknown[]) => void };

function WaButton({
  texto,
  children,
  className = "",
  size = "lg",
}: {
  texto: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "lg";
}) {
  const sizes =
    size === "lg"
      ? "min-h-14 px-4 text-base gap-2 min-[360px]:px-7 min-[360px]:text-lg min-[360px]:gap-2.5"
      : "min-h-11 px-4 text-base gap-2";
  return (
    <a
      href={wa(texto)}
      target="_blank"
      rel="noopener noreferrer"
      // Si instalás el Pixel de Meta en index.html, cada toque cuenta como "Contact".
      onClick={() => (window as FbqWindow).fbq?.("track", "Contact")}
      className={`inline-flex items-center justify-center rounded-2xl bg-wa font-bold text-wa-ink shadow-lg shadow-wa/30 transition-transform duration-150 hover:brightness-105 active:scale-[0.97] ${sizes} ${className}`}
    >
      <WaIcon className={size === "lg" ? "h-5 w-5 min-[360px]:h-6 min-[360px]:w-6" : "h-5 w-5"} />
      {children}
    </a>
  );
}


function Microcopy({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      Sin formularios. Te atiende una persona.
    </p>
  );
}

/** Etiqueta de precio grande y visible (para quien no lee, el número tiene que saltar a la vista). */
function PrecioBadge({ tipo, className = "" }: { tipo: TipoCV; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-extrabold shadow-md ${
        tipo.destacado ? "bg-ink text-marker" : "bg-marker text-ink"
      } ${className}`}
    >
      {gs(tipo.precio)}
    </span>
  );
}

// ---------- Página ----------

export default function Home() {
  const { rubro: slug } = useParams<{ rubro: string }>();
  const [params] = useSearchParams();
  const rubro = buscarRubro(slug);
  const ref = params.get("ref");
  const [conNota, setConNota] = useState(false);
  const abierto = atendiendoAhora();

  /** Mensaje precargado de WhatsApp: ya dice qué CV y cuánto sale, así nadie pregunta el precio. */
  const mensaje = (
    tipoId: TipoCV["id"] = "clasico",
    opts: { rubroNombre?: string | undefined; nota?: boolean } = {},
  ) => {
    const t = tipoPorId(tipoId);
    const nombre = nombreCompleto(t);
    const de = opts.rubroNombre ? ` de ${opts.rubroNombre.toLowerCase()}` : "";
    const extra = opts.nota ? ` + ${NOTA.nombre.toLowerCase()}` : "";
    const total = t.precio + (opts.nota ? NOTA.precio : 0);
    const base = `Hola, quiero mi ${nombre}${de}${extra} (${gs(total)}) 👋`;
    return ref ? `${base} [${ref}]` : base;
  };
  const mensajeRubro = () => mensaje("clasico", { rubroNombre: rubro?.nombre });

  const ejemplos: Ejemplo[] = [
    ...(rubro ? [rubro, ...RUBROS.filter((r) => r !== rubro)] : RUBROS).map(
      (r): Ejemplo => ({ key: r.slug, titulo: r.nombre, img: r.img, tipo: "clasico" }),
    ),
    ...EJEMPLOS_HARVARD,
  ];

  // El botón flotante aparece recién cuando el botón principal sale de pantalla.
  const heroCta = useRef<HTMLDivElement>(null);
  const [mostrarFlotante, setMostrarFlotante] = useState(false);
  useEffect(() => {
    const el = heroCta.current;
    if (!el || !("IntersectionObserver" in window)) {
      setMostrarFlotante(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setMostrarFlotante(!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.title = rubro
      ? `CV de ${rubro.nombre.toLowerCase()} en ${ENTREGA} · ${PRECIO} | ${DOMINIO}`
      : `Tu currículum en ${ENTREGA} · ${PRECIO} | ${DOMINIO}`;
  }, [rubro]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-ink antialiased">
      {/* ENCABEZADO: logo + precio siempre visible */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <img src={logo} alt="pediloaquí" width={224} height={56} className="h-7 w-auto" />
          <a
            href="#precios"
            className="whitespace-nowrap rounded-full bg-marker px-3 py-1.5 text-sm font-bold"
          >
            <span className="hidden min-[360px]:inline">CV </span>desde {PRECIO}
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="bg-frost">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12 md:pb-16 md:pt-12">
            <div className="min-w-0">
              <h1 className="text-[1.7rem] font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
                {rubro?.gancho ?? GANCHO_GENERAL}
              </h1>
              <p className="mt-3 text-lg leading-snug text-ink/80 md:text-xl">
                Contanos tus datos por WhatsApp y te lo armamos en{" "}
                <strong className="text-ink">{ENTREGA}</strong>, listo para imprimir o enviar.
              </p>

              {/* PRECIO GRANDE */}
              <div className="mt-5 overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {CLASICO.nombre}
                  </p>
                  <p className="whitespace-nowrap text-[2.4rem] font-extrabold leading-none tracking-tight sm:text-5xl">
                    {gs(CLASICO.precio)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-wa-dark">
                    Seña {gs(sena(CLASICO.precio))} para empezar · resto al recibir
                  </p>
                </div>
                <a
                  href="#precios"
                  className="flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-sm text-white"
                >
                  <span>⭐ {nombreCompleto(HARVARD)}</span>
                  <span className="whitespace-nowrap font-extrabold text-marker">
                    {gs(HARVARD.precio)} →
                  </span>
                </a>
              </div>

              <div ref={heroCta} className="mt-5">
                <WaButton texto={mensajeRubro()} className="w-full sm:w-auto">
                  Quiero mi CV · {PRECIO}
                </WaButton>
                <p className="mt-2 flex items-start gap-2 text-sm font-medium">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${abierto ? "animate-pulse bg-wa" : "bg-marker"}`}
                  />
                  {abierto
                    ? "Atendiendo ahora: te respondemos al toque."
                    : `Fuera de horario: te respondemos desde las ${HORARIO.desde}:00.`}
                </p>
                <Microcopy />
              </div>

              <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold sm:text-sm">
                <li className="rounded-xl bg-white px-2 py-3 ring-1 ring-line">
                  <span className="block text-xl" aria-hidden="true">⏱</span>Listo en 2 h
                </li>
                <li className="rounded-xl bg-white px-2 py-3 ring-1 ring-line">
                  <span className="block text-xl" aria-hidden="true">💬</span>Todo por WhatsApp
                </li>
                <li className="rounded-xl bg-white px-2 py-3 ring-1 ring-line">
                  <span className="block text-xl" aria-hidden="true">🤝</span>Mitad al empezar
                </li>
              </ul>
            </div>

            <img
              src={hero}
              alt="Un CV terminado impreso en papel y una conversación de WhatsApp donde se envía la vista previa y el PDF final."
              width={800}
              height={1000}
              fetchPriority="high"
              className="mx-auto w-full max-w-[21rem] md:max-w-sm lg:max-w-md"
            />
          </div>
        </section>

        {/* EJEMPLOS CON PRECIO */}
        <section aria-labelledby="ejemplos-title" className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="ejemplos-title" className="text-center text-2xl font-extrabold md:text-3xl">
              Mirá cómo queda
            </h2>
            <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
              Cada ejemplo tiene su precio. El tuyo sale con tus datos.
            </p>
            <p className="mt-3 text-center text-sm font-semibold text-muted-foreground md:hidden">
              Deslizá para ver más →
            </p>
          </div>
          <ul className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 md:mx-auto md:grid md:max-w-6xl md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
            {ejemplos.map((e) => {
              const t = tipoPorId(e.tipo);
              return (
                <li
                  key={e.key}
                  className="flex w-[68%] flex-none snap-center flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-line sm:w-[42%] md:w-auto"
                >
                  <div className="relative">
                    <img
                      src={e.img}
                      alt={`Ejemplo de ${t.nombre} para ${e.titulo.toLowerCase()}`}
                      loading="lazy"
                      width={700}
                      height={990}
                      className="w-full border-b border-line"
                    />
                    <PrecioBadge tipo={t} className="absolute bottom-3 right-3 text-base" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-bold leading-tight">{e.titulo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.nombre}
                      {t.sello ? ` · ${t.sello}` : ""}
                    </p>
                    <WaButton
                      texto={mensaje(e.tipo, {
                        rubroNombre: e.tipo === "clasico" ? e.titulo : undefined,
                      })}
                      size="sm"
                      className="mt-3 w-full"
                    >
                      Quiero uno así
                    </WaButton>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* PRECIOS — mismo diseño que la tarjeta de precios de WhatsApp */}
        <section id="precios" aria-labelledby="precio-title" className="bg-frost py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2
              id="precio-title"
              className="text-4xl font-extrabold leading-none tracking-tight md:text-5xl"
            >
              Precios
            </h2>
            <p className="mt-3 text-base text-ink/70 md:text-lg">
              Pago único · <strong className="text-ink">No es mensualidad</strong> ·{" "}
              {COMO_SE_PAGA}
            </p>

            <div className="mt-6 grid gap-4">
              {TIPOS_CV.map((t) => {
                const total = t.precio + (conNota ? NOTA.precio : 0);
                const oscuro = t.destacado;
                return (
                  <article
                    key={t.id}
                    className={`overflow-hidden rounded-3xl ${
                      oscuro ? "bg-ink text-white shadow-xl" : "bg-white ring-2 ring-line"
                    }`}
                  >
                    <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      <img
                        src={t.id === "harvard" ? EJEMPLOS_HARVARD[0]?.img : RUBROS[0]?.img}
                        alt=""
                        loading="lazy"
                        width={700}
                        height={990}
                        className="w-16 flex-none self-start rounded-md shadow-md ring-1 ring-black/5 sm:w-24"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                          <h3 className="text-xl font-extrabold leading-tight sm:text-2xl">
                            {t.nombre}
                            {t.sello && (
                              <span className="block text-base sm:text-xl">{minus(t.sello)}</span>
                            )}
                          </h3>
                          <p className="text-left sm:text-right">
                            <span
                              className={`block text-[2rem] font-extrabold leading-none tracking-tight sm:text-5xl ${
                                oscuro ? "text-marker" : "text-ink"
                              }`}
                            >
                              {gs(total).replace("Gs. ", "")}
                            </span>
                            <span className={`text-sm ${oscuro ? "text-white/70" : "text-muted-foreground"}`}>
                              guaraníes{conNota ? " · con nota" : ""}
                            </span>
                          </p>
                        </div>
                        <p className={`mt-2 text-sm leading-snug sm:text-base ${oscuro ? "text-white/80" : "text-ink/75"}`}>
                          {t.resumen}
                        </p>
                        <p
                          className={`mt-2 inline-block rounded-lg px-2.5 py-1 text-xs font-bold sm:text-sm ${
                            oscuro ? "bg-white/10 text-white" : "bg-frost text-ink"
                          }`}
                        >
                          Seña {gs(sena(total))} · resto al recibir
                        </p>
                      </div>
                    </div>

                    <details className={`faq-item mx-4 border-t sm:mx-5 ${oscuro ? "border-white/15" : "border-line"}`}>
                      <summary className="flex min-h-11 items-center justify-between gap-3 py-2 text-sm font-semibold">
                        ¿Qué incluye?
                        <svg
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          className="faq-chevron h-5 w-5 flex-none fill-none stroke-current opacity-60"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 7.5 5 5 5-5" />
                        </svg>
                      </summary>
                      <ul className="grid gap-2 pb-3">
                        {t.incluye.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm">
                            <Check className={oscuro ? "text-wa" : "text-wa-dark"} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </details>

                    <div className="p-4 pt-2 sm:p-5 sm:pt-2">
                      <WaButton
                        texto={mensaje(t.id, {
                          nota: conNota,
                          rubroNombre: t.id === "clasico" ? rubro?.nombre : undefined,
                        })}
                        className="w-full"
                      >
                        Quiero este · {gs(total)}
                      </WaButton>
                    </div>
                  </article>
                );
              })}

              {/* Extra: nota de presentación (se suma al CV que elijas) */}
              <label className="flex cursor-pointer items-center gap-3 rounded-3xl border-[3px] border-dashed border-marker bg-marker/15 px-4 py-4 sm:px-5">
                <input
                  type="checkbox"
                  checked={conNota}
                  onChange={(e) => setConNota(e.target.checked)}
                  className="h-6 w-6 flex-none accent-ink"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold leading-tight">
                    <span aria-hidden="true">✉️ </span>
                    {NOTA.nombre}
                  </span>
                  <span className="block text-sm text-ink/70">
                    Muchas empresas la piden junto al CV.
                  </span>
                </span>
                <span className="flex-none text-xl font-extrabold">+{gs(NOTA.precio).replace("Gs. ", "")}</span>
              </label>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Formas de pago">
              {PAGOS.map((p) => (
                <li
                  key={p}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold ring-2 ring-line"
                >
                  {p}
                </li>
              ))}
            </ul>

            <a
              href={wa(mensajeRubro())}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => (window as FbqWindow).fbq?.("track", "Contact")}
              className="mt-4 flex items-center gap-3 rounded-3xl bg-wa p-5 text-lg leading-snug text-wa-ink shadow-lg shadow-wa/30 transition-transform active:scale-[0.98]"
            >
              <WaIcon className="h-8 w-8" />
              <span>
                <strong>Para empezar:</strong> contanos tu nombre, dónde trabajaste y qué
                estudiaste, y pagás la seña. ¡Y arrancamos! 🙌
              </span>
            </a>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section aria-labelledby="pasos-title" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 id="pasos-title" className="text-center text-2xl font-extrabold md:text-3xl">
            Sin compu. Sin formularios.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
            Todo desde tu celular, en 3 pasos.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.t} className="flex gap-4 rounded-2xl bg-frost p-5 md:flex-col">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-marker"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 fill-none stroke-ink"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONOS_PASOS[i]}
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-bold">
                    <span className="text-muted-foreground">{i + 1}.</span> {p.t}
                  </h3>
                  <p className="mt-1 text-base leading-snug text-ink/80">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* PAGÁS DESPUÉS */}
        <section aria-labelledby="confianza-title" className="bg-frost py-12">
          <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr]">
            <img
              src={vistaPrevia}
              alt="Vista previa de un CV con marca de agua, como la que recibís antes de pagar el resto."
              loading="lazy"
              width={700}
              height={990}
              className="mx-auto w-2/3 max-w-xs -rotate-2 rounded-lg shadow-xl ring-1 ring-line md:w-full"
            />
            <div>
              <h2 id="confianza-title" className="text-2xl font-extrabold md:text-3xl">
                La mitad para empezar, la otra mitad al ver tu CV
              </h2>
              <p className="mt-3 text-lg leading-snug text-ink/80">
                Con la seña arrancamos. Te mandamos una vista previa por WhatsApp y, cuando te gusta,
                pagás la otra mitad y te enviamos el PDF final, sin marca de agua.
              </p>
              <p className="mt-3 text-base font-semibold text-wa-dark">
                ¿Algo no te gusta? Lo corregimos antes de que pagues el resto.
              </p>
              <p className="mt-4 text-base font-semibold">
                {PAGOS.join(" · ")}
              </p>
            </div>
          </div>
        </section>

        {/* PREGUNTAS */}
        <section aria-labelledby="faq-title" className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 id="faq-title" className="text-center text-2xl font-extrabold md:text-3xl">
              Preguntas frecuentes
            </h2>
            <div className="mt-6 divide-y divide-line rounded-2xl bg-white ring-2 ring-line">
              {FAQ.map((f, i) => (
                <details key={f.q} className="faq-item group px-5" open={i < 2}>
                  <summary className="flex min-h-14 items-center justify-between gap-4 py-3 text-left text-base font-semibold">
                    {f.q}
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="faq-chevron h-5 w-5 flex-none fill-none stroke-muted-foreground"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 7.5 5 5 5-5" />
                    </svg>
                  </summary>
                  <p className="pb-4 text-base leading-snug text-ink/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CIERRE */}
        <section className="bg-frost">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold md:text-4xl">Que no se te pase la vacancia.</h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-ink/80">
            {abierto
              ? `Escribinos ahora y en ${ENTREGA} tenés tu currículum listo para entregar.`
              : "Dejanos tu mensaje ahora y a primera hora arrancamos con tu currículum."}
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <WaButton texto={mensajeRubro()} className="w-full sm:w-auto">
              Quiero mi CV · {PRECIO}
            </WaButton>
            <Microcopy />
            <p className="text-sm text-muted-foreground">Atendemos {HORARIO.texto.toLowerCase()}.</p>
          </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-4 py-6 pb-28 text-center text-sm text-muted-foreground md:pb-6">
        {DOMINIO} · Paraguay
      </footer>

      {/* BOTÓN FLOTANTE (solo celular) con precio */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
          mostrarFlotante ? "translate-y-0" : "translate-y-full"
        }`}
        inert={!mostrarFlotante}
      >
        <WaButton texto={mensajeRubro()} className="w-full">
          Pedí tu CV · {PRECIO}
        </WaButton>
      </div>
    </div>
  );
}
