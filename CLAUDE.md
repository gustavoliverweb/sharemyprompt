# ShareMyPrompt

Marketplace de activos de IA (prompts, flujos, agentes) para LATAM. UI en español.
Roles: ADMIN, EXPERTO, USUARIO. Ciclo: publicación (EXPERTO) → revisión (ADMIN) → venta → acceso permanente.

## Stack
- Next.js 16.2.4 (App Router) · React 19.2.4
- Tailwind CSS v4 — tokens vía `@theme` en `globals.css`, NO existe `tailwind.config.ts`
- Auth.js v5 beta (`next-auth@5.0.0-beta.31`) — JWT, maxAge 3600
- Prisma v7.8.0 + `@prisma/adapter-pg` sobre PostgreSQL
- Stripe SDK (test mode) · Cloudflare R2 vía `@aws-sdk/client-s3`

## Archivos críticos
- `lib/auth.config.ts` — callbacks jwt/session/authorized, edge-compatible (NO usar `NextResponse.redirect()` aquí, Auth.js v5 beta no lo maneja bien en edge)
- `lib/auth.ts` — providers Credentials + Google, upsert de usuario OAuth en el callback jwt
- `lib/db.ts` — PrismaClient singleton vía adapter pg
- `lib/categories.ts` — categorías reales: marketing, codigo, contenido, diseno, educacion, negocios, datos
- `middleware.ts` — protege /user-dashboard, /upload-active (EXPERTO|ADMIN), /admin (ADMIN), /cart, /finances (EXPERTO|ADMIN)
- `prisma.config.ts` — Prisma v7: la URL de conexión va aquí, NO en `schema.prisma`
- `app/generated/prisma/` — cliente generado, gitignored, se regenera con `prisma generate`

## Reglas críticas del proyecto
- `params` y `searchParams` en Server Components son `Promise<>` — deben awaitearse
- El explorador filtra con `?cat=` (no `?category=`)
- Callbacks de auth van en `auth.config.ts` porque corre en Edge Runtime
- `trustHost: true` es obligatorio en producción (Render.com) o Auth.js lanza `UntrustedHost`

## Comandos
```bash
npm install
cp .env.example .env        # completar DATABASE_URL, AUTH_SECRET, AUTH_URL, etc.
npx prisma migrate dev && npx prisma generate
npm run dev                  # http://localhost:3000
npm run build                # incluye prisma generate
npm run lint
```
No hay suite de tests automatizada — verificación manual únicamente.

## Estado del proyecto (actualizar según avance)
- Implementado: auth, wizard de publicación, ciclo de vida de assets, home con datos reales, checkout Stripe + webhook, reviews, panel admin (revisión, analytics básico).
- Pendiente de especificación (`docs/specs.md`): mensajería/chat, disputas, badge "Still Working", licencias personal/comercial, facturación/reembolsos.
- Pendiente de QA: flujos core no tienen verificación automatizada, solo manual.
