import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[color:var(--color-gold)] text-[color:var(--color-ink)] shadow-sm hover:bg-[#d2b892]",
  secondary:
    "border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-coffee-soft)]",
  ghost: "text-[color:var(--color-cream)] hover:bg-[rgba(196,168,130,0.12)]",
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
