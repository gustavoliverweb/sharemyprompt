"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/ui/StarRating";

interface ReviewFormProps {
  assetId: string;
  existingRating?: number;
  existingComment?: string | null;
}

export function ReviewForm({ assetId, existingRating, existingComment }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(existingRating ?? 0);
  const [comment, setComment] = useState(existingComment ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEdit = !!existingRating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Selecciona una calificación");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, rating, comment: comment.trim() || null }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al guardar la reseña");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar tu reseña?")) return;
    setLoading(true);
    await fetch(`/api/reviews/${assetId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  if (success) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] font-medium"
        style={{ background: "rgba(36,198,95,0.1)", border: "1px solid rgba(36,198,95,0.3)", color: "#24C65F" }}
      >
        ✓ {isEdit ? "Reseña actualizada" : "Reseña publicada"}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium" style={{ color: "rgba(242,242,242,0.5)" }}>
          {isEdit ? "Tu calificación actual" : "Calificación"}
        </span>
        <StarRating value={rating} onChange={setRating} size={26} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comparte tu experiencia con este activo (opcional)"
        maxLength={1000}
        rows={3}
        className="w-full resize-none text-[14px] rounded-lg px-4 py-3 outline-none transition-colors"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(242,242,242,0.85)",
        }}
      />

      {error && (
        <p className="text-[13px]" style={{ color: "#ff6b6b" }}>{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="px-5 py-2.5 rounded-pill text-[14px] font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "#623CEA", color: "#fff" }}
        >
          {loading ? "Guardando…" : isEdit ? "Actualizar reseña" : "Publicar reseña"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2.5 rounded-pill text-[14px] font-medium transition-opacity disabled:opacity-40"
            style={{ color: "rgba(242,242,242,0.4)", background: "rgba(255,255,255,0.05)" }}
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
