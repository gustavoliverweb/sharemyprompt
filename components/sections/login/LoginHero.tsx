import Image from "next/image";

export function LoginHero() {
  return (
    <div className="hidden lg:flex relative overflow-hidden  items-end p-16">
      {/* Background glows */}
      {/* <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-surface/0 to-surface/0" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-accent/5 blur-[80px] rounded-full" />
      </div> */}

      {/* Dot grid */}
      {/* <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      /> */}

      <Image
        src="/images/login/login-img.png"
        alt="Register Hero"
        width={650}
        height={500}
        className="absolute top-1/2 left-0  -translate-y-1/2 "
      />

      {/* Tagline */}
      <div className="relative z-10 ">
        <p className="text-[40px] xl:text-[39px] font-bold text-white leading-[1.15] tracking-tight">
          Tu ecosistema de autonomía digital te espera.
        </p>
      </div>
    </div>
  );
}
