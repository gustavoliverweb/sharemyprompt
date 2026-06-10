import Image from "next/image";

function SupportIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-file-text-icon lucide-file-text"
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function QualityIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-shield-check-icon lucide-shield-check"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <SupportIcon />,
    text: "Documentación técnica detallada y soporte directo del experto.",
  },
  {
    icon: <QualityIcon />,
    text: "Creadores y activos verificados bajo estrictos estándares de calidad.",
  },
];

export function MarketFeatureSection({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section className={`bg-surface ${className}`}>
      {/*
        Contenedor de 1440px: sección de 504px de alto.
        Imagen de fondo a x:25 (izquierda), contenido a x:929 (derecha).
        En mobile apilamos imagen arriba y contenido abajo.
      */}
      <div className="max-w-[1440px] mx-auto relative overflow-hidden lg:h-[504px]">
        {/* ── Imagen de fondo — lado izquierdo ───────────────────────── */}
        <div
          className="relative w-full h-64
                     lg:absolute lg:left-[25px] lg:top-0 lg:w-[708px] lg:h-full"
        >
          <Image
            src="/images/market-feature/market-feature-bg-35aacf.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 708px"
          />
          {/* Gradient fade hacia la derecha para integrar con el fondo oscuro */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(25,24,32,0) 40%, rgba(25,24,32,1) 100%)",
            }}
            aria-hidden
          />
        </div>

        {/* ── Contenido — lado derecho ────────────────────────────────── */}
        {/*
          En Figma: x:929, y:122, width:511px dentro de 1440px.
          En desktop usamos absolute; en mobile flujo normal con padding.
        */}
        <div
          className="px-6 py-10 flex flex-col gap-12
                     lg:absolute lg:left-[929px] lg:top-[122px] lg:w-[511px]
                     lg:p-0 lg:gap-12"
        >
          {/* Headline */}
          <h2 className="text-[32px] font-normal text-foreground leading-[1.302]">
            Somos el marketplace de activos de IA más especializado del mundo.
          </h2>

          {/* Feature cards — fila, gap:24px, cada una 175px alto en Figma */}
          <div className="flex flex-col sm:flex-row gap-6">
            {FEATURES.map(({ icon, text }) => (
              <div
                key={text}
                className="flex-1 flex flex-col gap-4 pt-6 rounded-[8px]"
              >
                {/* Icono 48×48 */}
                <div className="w-12 h-12 shrink-0">{icon}</div>
                {/* Texto */}
                <p className="text-base text-foreground/80 leading-[1.302]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
