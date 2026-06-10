const MARKET_ITEMS = [
  "Prompts de una sola línea sin estructura.",
  'Resultados aleatorios y "alucinaciones".',
  "Vendedores anónimos sin soporte.",
  "Archivos obsoletos que dejan de funcionar.",
];

const STANDARD_ITEMS = [
  "Ingeniería basada en el Framework de 6 Pilares.",
  "Activos verificados con consistencia lógica.",
  "Arquitectos de IA con reputación validada.",
  "Badge de Compatibilidad en tiempo real.",
];

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="10" cy="10" r="9.5" stroke="#E21A1A" strokeOpacity="0.4" />
      <path
        d="M6.5 6.5L13.5 13.5M13.5 6.5L6.5 13.5"
        stroke="#E21A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="11.5" stroke="#3CEA70" strokeOpacity="0.4" />
      <path
        d="M7 12L10.5 15.5L17 8.5"
        stroke="#3CEA70"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ComparisonCardProps {
  title: string;
  description: string;
  items: string[];
  variant: "market" | "standard";
}

function ComparisonCard({
  title,
  description,
  items,
  variant,
}: ComparisonCardProps) {
  const isStandard = variant === "standard";

  return (
    <div
      className="flex flex-col gap-8 p-6 rounded-lg border"
      style={{
        background: "#191820",
        borderColor: isStandard
          ? "rgba(0,245,255,0.15)"
          : "rgba(255,255,255,0.08)",
      }}
    >
      {/* Card header */}
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl lg:text-[38px] font-medium text-white leading-tight">
          {title}
        </h3>
        <p className="text-base text-foreground/55 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{
          background: isStandard
            ? "linear-gradient(90deg, rgba(0,245,255,0.3) 0%, rgba(0,245,255,0) 100%)"
            : "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)",
        }}
        aria-hidden
      />

      {/* Bullet list */}
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            {isStandard ? <CheckIcon /> : <XIcon />}
            <span className="text-base font-medium text-foreground/85 leading-snug">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutEcosystemSection() {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-3 mb-20">
          <p
            className="text-sm font-medium tracking-[0.2em] uppercase"
            style={{ color: "#00F5FF" }}
          >
            Ecosistema
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            El Problema vs. Nuestra Solución
          </h2>
          <p className="text-base md:text-lg text-foreground/55 max-w-xl leading-relaxed mt-1">
            Ya sea que busques la eficiencia máxima o quieras rentabilizar tu
            ingenio, ShareMyPrompt es tu centro de operaciones en la era de la
            IA.
          </p>
        </div>

        {/* Cards wrapper with decorative background glows */}
        <div className="relative overflow-hidden">
          {/* Cyan glow — left (Group 1722) */}
          <div
            className="absolute -top-8 -left-12 w-[560px] h-[380px] rounded-xl pointer-events-none"
            style={{
              background:
                "linear-gradient(137deg, rgba(0,245,255,0.1) 0%, rgba(0,245,255,0) 45%)",
              filter: "blur(40px)",
            }}
            aria-hidden
          />

          {/* Orange glow — right (Group 1721) */}
          <div
            className="absolute top-8 -right-12 w-[540px] h-[420px] rounded-xl pointer-events-none"
            style={{
              background:
                "linear-gradient(137deg, rgba(255,159,28,0.08) 0%, rgba(255,159,28,0) 40%)",
              filter: "blur(40px)",
            }}
            aria-hidden
          />

          {/* Comparison cards */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <ComparisonCard
              title="El Mercado Común"
              description='Deja de "adivinar" qué decirle a la IA. Accede a activos técnicos que ya pasaron por el proceso de ensayo y error por ti.'
              items={MARKET_ITEMS}
              variant="market"
            />
            <ComparisonCard
              title="El Estándar ShareMyPrompt"
              description="Convierte tus mejores estructuras de trabajo en una fuente de ingresos pasivos. Nosotros nos encargamos de la infraestructura, tú de la ingeniería."
              items={STANDARD_ITEMS}
              variant="standard"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
