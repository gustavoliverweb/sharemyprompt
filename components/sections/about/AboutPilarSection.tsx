"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const PILARS = [
  {
    number: "Pilar 1",
    title: "Rol",
    description:
      "Asignamos una identidad experta y un tono específico a la IA. Esto garantiza respuestas con terminología técnica avanzada, eliminando resultados genéricos y superficiales.",
  },
  {
    number: "Pilar 2",
    title: "Contexto",
    description:
      'Explicamos el "por qué" y el público objetivo. Proporcionar datos de fondo asegura que la solución esté perfectamente alineada con las necesidades reales del usuario.',
  },
  {
    number: "Pilar 3",
    title: "Tarea",
    description:
      "Transformamos objetivos ambiguos en acciones directas mediante verbos operativos. La claridad en este paso separa un resultado mediocre de una ejecución técnica impecable y funcional.",
  },
  {
    number: "Pilar 4",
    title: "Formato",
    description:
      "Determinamos la arquitectura visual del resultado. Ya sea código, tablas o archivos JSON, garantizamos que el contenido esté listo para integrarse sin ajustes manuales.",
  },
  {
    number: "Pilar 5",
    title: "Restricciones",
    description:
      "Establecemos reglas para evitar alucinaciones y respuestas fuera de tono. Es el filtro crítico que mantiene a la IA enfocado en los parámetros técnicos requeridos.",
  },
  {
    number: "Pilar 6",
    title: "Iteraciones",
    description:
      "Definimos cómo interactuar con la IA para pulir el resultado inicial. Este pilar permite ajustar variantes y profundizar en puntos específicos según la evolución del proyecto.",
  },
];

// Each card is offset 10px right+down from the previous (proportional to Figma's 24px on 540px card)
const STACK_STEP = 24;

export function AboutPilarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>(
    Array(PILARS.length).fill(null),
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      // All cards start hidden below the section
      gsap.set(cards, { y: 700 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 3.5}`,
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });

      // Cards slide up one by one — pilar1 first, pilar6 last
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            y: 0,
            // opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          i * 0.6,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  const CARD_W = 540;
  const CARD_H = 467;
  const step = isMobile ? 0 : STACK_STEP;
  const stackW = CARD_W + step * (PILARS.length - 1);
  const stackH = CARD_H + step * (PILARS.length - 1);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-surface flex flex-col items-center justify-center pt-10 pb-20"
    >
      <Image
        src="/images/about/grid.png"
        alt=""
        fill
        className="image-grid object-cover object-top"
      />
      {/* Section header */}
      <div className="max-w-screen-xl w-full mx-auto px-6 mb-20 relative">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-medium text-white leading-[1.1] tracking-tight max-w-2xl">
            Es{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00F5FF]">
              ingeniería
            </span>{" "}
            de precisión
          </h2>
          <p className="text-base md:text-lg text-foreground/55 max-w-2xl leading-relaxed">
            Todos nuestros activos técnicos se rigen por un framework de calidad
            obligatorio para garantizar resultados predecibles.
          </p>
        </div>
      </div>

      {/* Card stack — cards are absolute positioned, stacked with small offsets */}
      <div className="w-full px-6 md:px-0 flex justify-center">
        <div
          className="relative w-full md:w-auto"
          style={{ width: isMobile ? undefined : stackW, height: stackH }}
        >
          {PILARS.map((pilar, i) => (
            <div
              key={pilar.number}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="absolute rounded-2xl overflow-hidden backdrop-blur-md"
              style={{
                width: isMobile ? "100%" : CARD_W,
                height: CARD_H,
                left: i * step,
                top: i * step,
                zIndex: i + 1,
                backgroundColor: "#19182085",
                border: "1px solid #ffffff4a",
              }}
            >
              {/* Text content */}
              <div className="relative z-10 flex flex-col gap-8 p-6 pb-0 h-[256px]">
                <p className="text-[49px] font-bold leading-none text-foreground/70 select-none">
                  {pilar.number}
                </p>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-medium text-white leading-snug">
                    {pilar.title}
                  </h3>
                  <p className="text-[20px] text-foreground/80 leading-relaxed">
                    {pilar.description}
                  </p>
                </div>
              </div>

              {/* Bottom decorative area (211px) */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height: 211 }}
                aria-hidden
              >
                <Image
                  src="/images/about/pilar-card-img.png"
                  alt=""
                  fill
                  className="object-cover object-top"
                />
                {/* Dot grid pattern */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                {/* Dark fade from top of decorative area */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #191820 0%, rgba(25,24,32,0) 60%)",
                  }}
                />
                {/* Purple-to-white glow at the bottom edge — matches fill_23ROE0 */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(184deg, rgba(98,60,234,0) 44%, rgba(255,255,255,0.1) 99%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
