"use client";

import { SessionProvider as NextSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    // El rol se re-consulta en la DB en cada auth() server-side (ver el
    // callback jwt en lib/auth.ts), así que el servidor nunca queda
    // desfasado. Lo que sí se cachea en el cliente es la sesión que usan
    // componentes como Navbar/DashboardSidebar (useSession) — sin esto,
    // un cambio de rol solo se reflejaba ahí al reenfocar la ventana o
    // esperar la expiración del JWT (hasta 1h).
    <NextSessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      {children}
    </NextSessionProvider>
  );
}
