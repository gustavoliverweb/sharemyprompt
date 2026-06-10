"use client";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 22 }: StarRatingProps) {
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            style={{
              cursor: interactive ? "pointer" : "default",
              background: "none",
              border: "none",
              padding: "1px",
              lineHeight: 1,
            }}
            aria-label={interactive ? `${star} estrella${star !== 1 ? "s" : ""}` : undefined}
            tabIndex={interactive ? 0 : -1}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#F5A623" : "none"}
              stroke={filled ? "#F5A623" : "rgba(242,242,242,0.3)"}
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
