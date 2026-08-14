import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});

// coverImage ya es una URL absoluta de R2; solo se antepone appUrl si llegara una ruta relativa
export function toStripeImageUrl(coverImage: string, appUrl: string): string {
  return coverImage.startsWith("http") ? coverImage : `${appUrl}${coverImage}`;
}
