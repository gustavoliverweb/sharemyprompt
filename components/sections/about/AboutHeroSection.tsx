import Image from "next/image";
import Link from "next/link";

export function AboutHeroSection() {
  return (
    <section className="relative bg-surface overflow-hidden pt-14 pb-24">
      {/* Decorative glows */}
      {/* <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/15 blur-[140px] rounded-full" />
        <div className="absolute top-32 left-1/4 w-[350px] h-[350px] bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute top-32 right-1/4 w-[350px] h-[350px] bg-primary-dark/10 blur-[100px] rounded-full" />
      </div> */}

      <div className="relative max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text content */}
          <div className="flex-1 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-white/10 bg-white/[0.04] text-xs font-medium text-foreground/60 tracking-widest uppercase mb-8">
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                aria-hidden
              />
              Sobre nosotros
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Elevando el Estándar de la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00F5FF]">
                Inteligencia Artificial.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-foreground/55 leading-relaxed mb-10 max-w-xl">
              No solo dictamos palabras; diseñamos el comportamiento de la
              tecnología. En ShareMyPrompt, fusionamos la ingeniería de prompts
              con flujos de automatización avanzados y arquitecturas de agentes
              IA para convertir la inteligencia artificial en tu fuerza de
              trabajo más eficiente.
            </p>

            {/* CTAs */}
            {/* <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-pill bg-gradient-to-b from-primary to-primary-dark text-white font-medium text-sm px-7 py-3 shadow-[0_0_20px_rgba(98,60,234,0.35)] hover:shadow-[0_0_30px_rgba(98,60,234,0.55)] hover:opacity-90 transition-all duration-200"
              >
                Explorar el marketplace
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center rounded-pill border border-white/25 text-foreground font-medium text-sm px-7 py-3 hover:border-white/50 hover:bg-white/5 transition-all duration-200"
              >
                Convertirme en arquitecto
              </Link>
            </div> */}
          </div>

          {/* Hero image */}
          <div className="relative w-full max-w-[560px] lg:max-w-none lg:w-[500px] xl:w-[560px] shrink-0">
            <div className="relative rounded-2xl overflow-hidden ">
              <Image
                src="/images/about/hero-about-image.png"
                alt="Plataforma ShareMyPrompt"
                width={560}
                height={424}
                className="w-full h-auto"
                priority
              />
              {/* Subtle gradient overlay on image bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface/60 to-transparent pointer-events-none"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
