import Image from "next/image";
import Link from "next/link";

interface Category {
  title: string;
  description: string;
  href: string;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    title: "Marketing & ventas",
    description: "Prompts y agentes para campañas, copy y cierre de ventas",
    href: "/explorer?cat=marketing",
    image: "/images/categories/category-bg-1.png",
  },
  {
    title: "Código & desarrollo",
    description: "Scripts, revisiones de código y arquitectura de software",
    href: "/explorer?cat=codigo",
    image: "/images/categories/category-bg-3.png",
  },
  {
    title: "Contenido & texto",
    description: "Redacción, guiones, newsletters y estrategia editorial",
    href: "/explorer?cat=contenido",
    image: "/images/categories/category-bg-2.png",
  },
  {
    title: "Diseño & visión",
    description: "Master prompts para Midjourney, DALL·E y generación visual",
    href: "/explorer?cat=diseno",
    image: "/images/categories/category-bg-4.png",
  },
  {
    title: "Negocios & estrategia",
    description: "Automatizaciones y flujos para ahorrar horas cada semana",
    href: "/explorer?cat=negocios",
    image: "/images/categories/category-bg-2.png",
  },
  {
    title: "Datos & análisis",
    description: "Prompts de SQL, BI y transformación de datos en decisiones",
    href: "/explorer?cat=datos",
    image: "/images/categories/category-bg-1.png",
  },
];

function CategoryCard({ title, description, href, image }: Category) {
  return (
    <Link
      href={href}
      className="group relative md:flex-1 h-[344px] rounded-[16px] border border-white/30 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Background image */}
      <Image
        src={image}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />

      {/* Radial vignette — rgba(25, 24, 32, 0) center → rgba(25, 24, 32, 1) edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(25,24,32,0) 0%, rgba(25,24,32,0.9) 100%)",
        }}
        aria-hidden
      />

      {/* Text container — glass morphism */}
      <div
        className="absolute inset-x-0 top-0 p-4"
        style={{
          backdropFilter: "blur(16px)",
          background: "rgba(25,25,33,0.2)",
        }}
      >
        <p className="text-[25px] font-bold text-white leading-[1.04] mb-2">
          {title}
        </p>
        <p className="text-sm text-white/80 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

interface CategoriesSectionProps {
  className?: string;
}

export function CategoriesSection({ className = "" }: CategoriesSectionProps) {
  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col gap-8">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row gap-8">
          {CATEGORIES.slice(0, 3).map((cat) => (
            <CategoryCard key={cat.href} {...cat} />
          ))}
        </div>
        {/* Row 2 */}
        <div className="flex flex-col md:flex-row gap-8">
          {CATEGORIES.slice(3, 6).map((cat) => (
            <CategoryCard key={cat.href} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
