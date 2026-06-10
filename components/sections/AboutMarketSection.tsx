import Image from "next/image";
import Link from "next/link";

export function AboutMarketSection({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6">
        {/*
          Card: 1333×490px en Figma.
          - Sin fondo (transparente), border 2px #665996, radius 16px.
          - Texto en columna de 400px posicionado a x:380 dentro del card.
          - Imagen de producto a x:900, 831×425px (se recorta en el borde derecho).
        */}
        <div
          className="content-border-overflow relative  rounded-[16px] max-w-[1333px] mx-auto
                     flex flex-col lg:flex-row  lg:h-[490px] items-center justify-between"
        >
          {/* ── Contenido textual ─────────────────────────────────────── */}
          <div
            className="flex flex-col flex-1 gap-6 p-8
                       lg:p-0 lg:max-w-[45ch]"
          >
            {/* Logo */}
            <span className="text-[36px] font-bold text-foreground uppercase tracking-tight leading-[1.167]">
              ShareMyPrompt
            </span>

            {/* Headline + body */}
            <div className="flex flex-col gap-4">
              <p className="text-[35px] font-normal text-foreground leading-[1.302]">
                Crea soluciones inteligentes con activos de IA ilimitados.
              </p>
              <p className="text-base text-foreground/70 leading-[1.302]">
                Accede a descargas de Plantillas de Automatización, Scripts de
                Python y millones de instrucciones técnicas verificadas.
                Optimiza cada proceso con nuestras herramientas de ingeniería:
                Validación de Calidad, Badge de Compatibilidad y soporte directo
                de expertos.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/explore"
              className="inline-flex items-center justify-center w-fit rounded-pill
                         px-8 py-2 text-base font-normal text-white
                         transition-opacity hover:opacity-90"
              style={{
                background:
                  "linear-gradient(180deg, rgba(98,60,234,1) 0%, rgba(55,34,132,1) 94%)",
                boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.3)",
              }}
            >
              Comenzar ahora
            </Link>
          </div>

          {/* ── Imagen producto ───────────────────────────────────────── */}
          {/*
            En desktop: posicionada absolutamente a x:900, y:32 (831×425px).
            El overflow:hidden del card recorta el lado derecho — efecto intencional del Figma.
            En mobile: imagen responsive al final del card.
          */}
          <div
            className="relative mx-8 mb-8 h-[220px]
                       lg:mx-0 lg:mb-0  lg:mb-[100px]"
          >
            <Image
              src="/images/about/about-product.png"
              alt="Vista previa del marketplace ShareMyPrompt"
              className="object-cover object-left rounded-lg lg:rounded-none"
              width={831}
              height={300}
              sizes="(max-width: 800px) 90vw, 600px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
