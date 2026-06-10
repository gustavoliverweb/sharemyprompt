export function AboutArchitectSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col gap-4">
        {/* Sub-heading — muted, centered, DM Sans Medium 31px */}
        <p className="text-center text-xl md:text-2xl font-medium text-foreground/50 leading-snug">
          ¿Quiénes son los &ldquo;Arquitectos&rdquo;?
        </p>

        {/* Statement — DM Sans Regular 49px, left-aligned, white */}
        <p className="text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-normal text-white leading-[1.22]">
          No aceptamos a cualquiera. Nuestros autores son ingenieros,
          desarrolladores y creativos que entienden que un prompt es código.
          Cada activo en nuestra tienda ha pasado por una auditoría técnica
          antes de llegar a tus manos.
        </p>
      </div>
    </section>
  )
}
