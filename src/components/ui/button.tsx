import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[color:var(--color-olive)] text-white shadow-sm hover:bg-[color:var(--color-olive-dark)]",
  secondary:
    "border border-[color:var(--color-clay-beige)] bg-[rgba(248,246,241,0.82)] text-[color:var(--color-warm-graphite)] hover:bg-white",
  ghost: "text-[color:var(--color-warm-graphite)] hover:bg-[rgba(201,191,177,0.28)]",
  danger: "bg-[color:var(--color-danger)] text-white shadow-sm hover:bg-[#88443b]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  leftIcon,
  rightIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(104,98,70,0.2)] disabled:pointer-events-none disabled:opacity-55",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!isLoading ? rightIcon : null}
    </button>
  );
}
