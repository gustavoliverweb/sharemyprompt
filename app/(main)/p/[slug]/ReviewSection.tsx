import { prisma } from "@/lib/db";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewForm } from "./ReviewForm";

interface ReviewSectionProps {
  assetId: string;
  currentUserId?: string;
  canReview: boolean;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function ReviewSection({ assetId, currentUserId, canReview }: ReviewSectionProps) {
  const reviews = await prisma.review.findMany({
    where: { assetId },
    include: { user: { select: { username: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / total : null;

  const userReview = currentUserId
    ? reviews.find((r) => r.userId === currentUserId)
    : null;

  const otherReviews = userReview
    ? reviews.filter((r) => r.userId !== currentUserId)
    : reviews;

  return (
    <section className="max-w-screen-xl mx-auto px-6 mt-16 mb-24">
      <div className="flex flex-col gap-8" style={{ maxWidth: "680px" }}>
        {/* Header */}
        <div className="flex items-center gap-5">
          <h2 className="text-[25px] font-medium text-foreground">Reseñas</h2>
          {avg !== null && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avg)} size={18} />
              <span className="text-[15px] font-semibold text-white">{avg.toFixed(1)}</span>
              <span className="text-[13px]" style={{ color: "rgba(242,242,242,0.4)" }}>
                ({total} {total === 1 ? "reseña" : "reseñas"})
              </span>
            </div>
          )}
          {total === 0 && (
            <span className="text-[14px]" style={{ color: "rgba(242,242,242,0.35)" }}>
              Sin reseñas aún
            </span>
          )}
        </div>

        {/* Formulario del usuario actual */}
        {canReview && (
          <div
            className="flex flex-col gap-4 p-5 rounded-xl"
            style={{ background: "rgba(98,60,234,0.06)", border: "1px solid rgba(98,60,234,0.15)" }}
          >
            <p className="text-[15px] font-medium text-white">
              {userReview ? "Tu reseña" : "Escribe tu reseña"}
            </p>
            <ReviewForm
              assetId={assetId}
              existingRating={userReview?.rating}
              existingComment={userReview?.comment}
            />
          </div>
        )}

        {/* Lista de reseñas */}
        {otherReviews.length > 0 && (
          <div className="flex flex-col gap-5">
            {otherReviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-2 p-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-medium text-white">
                      {review.user.name ?? `@${review.user.username}`}
                    </span>
                    <StarRating value={review.rating} size={15} />
                  </div>
                  <span className="text-[12px]" style={{ color: "rgba(242,242,242,0.3)" }}>
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-[14px] leading-relaxed" style={{ color: "rgba(242,242,242,0.65)" }}>
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {total === 0 && !canReview && (
          <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.35)" }}>
            Aún no hay reseñas para este activo. ¡Adquiérelo y sé el primero en opinar!
          </p>
        )}
      </div>
    </section>
  );
}
