const CORE_FEATURES = [
  {
    number: "01",
    title: "Ingeniería de Prompts",
    description:
      "Instrucciones de alta precisión que eliminan la ambigüedad y maximizan el razonamiento de los LLMs.",
  },
  {
    number: "02",
    title: "Automatizaciones",
    description:
      "Blueprints de Make, Zapier y scripts de Python que conectan tus herramientas favoritas para ejecutar tareas en piloto automático.",
  },
  {
    number: "03",
    title: "Agentes IA",
    description:
      "Sistemas configurados para razonar, usar herramientas y completar objetivos complejos de principio a fin sin intervención humana constante.",
  },
];

export function AboutCoreSection() {
  return (
    <section className="wrapper-circle-gradient pb-24 mt-40 bg-surface relative">
      <div
        className="circle-gradient"
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          width: "200px",
          height: "200px",
          backgroundColor: "#00F5FF",
          borderRadius: "50%",
          // opacity: "0.3",
          transform: "translateX(-50%)",
          zIndex: 10,
          filter: "blur(80px)",
        }}
      ></div>
      <div className="max-w-screen-xl mx-auto px-6 relative z-[200]">
        <div className="flex flex-col gap-0">
          {CORE_FEATURES.map((feature, index) => (
            <div key={feature.number}>
              {/* Item */}
              <div className="flex flex-col gap-10 py-16  max-w-[900px]">
                {/* Number + heading group — stretches full available width */}
                <div className="flex-1">
                  <p
                    className="font-display text-5xl lg:text-[61px] leading-none text-foreground/20 mb-4 select-none"
                    aria-hidden
                  >
                    {feature.number}
                  </p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] tracking-tight">
                    {feature.title}
                  </h2>
                </div>

                {/* Paragraph — right-aligned, max ~646px */}
                <p className="text-lg md:text-xl lg:text-2xl text-foreground/60 leading-relaxed max-w-md lg:max-w-[440px] lg:text-right lg:pb-2 self-end">
                  {feature.description}
                </p>
              </div>
              {/* Divider above first item too — matches Figma where lines wrap all items */}
              <div
                className="h-px w-1/2 lg:w-[520px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(242,242,242,0.5) 0%, rgba(242,242,242,0) 100%)",
                }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
