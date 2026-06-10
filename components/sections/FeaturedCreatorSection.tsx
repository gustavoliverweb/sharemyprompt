import Link from "next/link";
import { SimpleProductCard } from "@/components/ui/SimpleProductCard";

const PRODUCTS = [
  {
    id: "seo-descripciones",
    title: "Generador Masivo: Descripciones de Productos SEO",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-seo-descripciones.png",
    href: "/p/generador-masivo-descripciones-seo",
  },
  {
    id: "onboarding-saas",
    title: "Flujo Completo: Onboarding de Clientes SaaS",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-onboarding-saas.png",
    href: "/p/flujo-completo-onboarding-saas",
  },
  {
    id: "asistente-sql",
    title: "Asistente SQL: Convierte Lenguaje Natural en Consultas Complejas",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-asistente-sql.png",
    href: "/p/asistente-sql-lenguaje-natural",
  },
  {
    id: "lora-arquitectura",
    title: "LoRA Especializado: Renders de Arquitectura Interior Fotorrealista",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-lora-arquitectura.png",
    href: "/p/lora-renders-arquitectura-interior",
  },
];

export function FeaturedCreatorSection({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-14">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
          {/* Left sidebar */}
          <div className="flex flex-col gap-6 lg:w-[330px] shrink-0">
            <div className="flex flex-col gap-2">
              <p className="text-[31px] font-bold text-foreground leading-[1.25]">
                Creador destacado
              </p>
              <p className="text-[24px] font-normal text-foreground leading-[1.25]">
                Irobot
              </p>
              <p
                className="text-[16px] font-normal leading-[1.5]"
                style={{ color: "rgba(242,242,242,0.6)" }}
              >
                Miembro desde diciembre de 2019
              </p>
            </div>

            <Link
              href="/creator/irobot"
              className="inline-flex items-center justify-center w-fit rounded-pill px-8 py-2 text-base font-normal text-white transition-opacity hover:opacity-90"
              style={{
                background:
                  "linear-gradient(180deg, rgba(98,60,234,1) 0%, rgba(55,34,132,1) 94%)",
                boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.3)",
              }}
            >
              Ver proyectos
            </Link>
          </div>

          {/* Right: description */}
          <p
            className="flex-1 text-[16px] font-normal text-foreground"
            style={{ lineHeight: "2.25" }}
          >
            Nuestros activos y automatizaciones son desarrollados por ingenieros
            de prompts de clase mundial (o Arquitectos, como los llamamos
            nosotros). Explora lo mejor de la semana.
          </p>
        </div>

        {/* Products row */}
        <div className="flex flex-col md:flex-row gap-8">
          {PRODUCTS.map((p) => (
            <SimpleProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
