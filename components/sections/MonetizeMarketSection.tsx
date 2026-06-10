import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Publicación simplificada:",
    description:
      "Sube tus activos siguiendo nuestro Framework de 6 Pilares y obtén el sello de calidad de la plataforma.",
  },
  {
    title: "Protección y Disputas:",
    description:
      "Vende con tranquilidad. Contamos con un sistema de mediación gestionado por expertos para proteger tu autoría.",
  },
  {
    title: "Pagos directos y transparentes:",
    description:
      "Recibe tus ganancias de forma clara y segura. Controla tus métricas de ventas desde tu panel privado.",
  },
  {
    title: "Audiencia global cualificada:",
    description:
      "Pon tus productos frente a miles de profesionales y empresas que ya están buscando soluciones de IA.",
  },
];

function FlowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="3" cy="8" r="2" fill="#F2F2F2" fillOpacity="0.7" />
      <path
        d="M5 8h4M11 5l3 3-3 3"
        stroke="#F2F2F2"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MonetizeMarketSection({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center gap-8">
        {/* Content row */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-12 w-full">
          {/* Left: content card */}
          <div
            className="flex flex-col gap-8 rounded-[8px] lg:w-[600px] shrink-0"
            style={{ background: "#191820", padding: "24px 0 24px 24px" }}
          >
            {/* Title + subtitle */}
            <div className="flex flex-col gap-4 pr-6">
              <h2
                className="text-foreground"
                style={{ fontSize: "49px", fontWeight: 500, lineHeight: 1.225 }}
              >
                Monetiza tu conocimiento en IA
              </h2>
              <p className="text-foreground text-[20px] leading-[1.3]">
                Convierte tus mejores estructuras de trabajo en una fuente de
                ingresos pasivos. Nosotros nos encargamos de la infraestructura,
                tú de la ingeniería.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-6">
              {FEATURES.map(({ title, description }) => (
                <div key={title} className="flex flex-col gap-4">
                  {/* Icon + bold title */}
                  <div className="flex items-center gap-2">
                    <span className="shrink-0">
                      <FlowIcon />
                    </span>
                    <p className="text-[16px] font-bold text-foreground leading-[1.625]">
                      {title}
                    </p>
                  </div>
                  {/* Description indented */}
                  <p
                    className="text-[16px] text-foreground leading-[1.625]"
                    style={{ paddingLeft: "24px" }}
                  >
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: product screenshots placeholder */}
          <div
            className="relative mx-8 mb-8 h-[500px]
                                 lg:mx-0 lg:mb-0  lg:mb-[100px] w-full"
          >
            <Image
              src="/images/monetize/monetize-img.png"
              alt="Vista previa del marketplace ShareMyPrompt"
              className="object-cover object-left rounded-lg lg:rounded-none"
              fill
              sizes="(max-width: 800px) 90vw, 600px"
              priority
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/sell"
          className="inline-flex items-center justify-center rounded-pill px-8 py-2 text-base font-bold text-white transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(180deg, rgba(98,60,234,1) 0%, rgba(55,34,132,1) 94%)",
            boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.3)",
          }}
        >
          Aplicar como Experto
        </Link>
      </div>
    </section>
  );
}
