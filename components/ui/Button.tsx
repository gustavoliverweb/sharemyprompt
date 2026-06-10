import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-primary to-primary-dark text-white shadow-[0_0_20px_rgba(98,60,234,0.35)] hover:shadow-[0_0_30px_rgba(98,60,234,0.55)] hover:opacity-90",
  outline:
    "border border-white/30 text-foreground hover:border-white/60 hover:bg-white/5",
  ghost: "text-foreground/70 hover:text-foreground hover:bg-white/5",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-1.5 text-xs",
  md: "px-7 py-2.5 text-sm",
  lg: "px-9 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-pill font-medium transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
