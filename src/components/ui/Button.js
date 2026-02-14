import { cn } from "@/lib/utils";

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group";
  
  const sizes = {
    sm: "min-h-[36px] px-3 py-1.5 text-xs",
    md: "min-h-[44px] px-4 py-2.5 text-sm",
    lg: "min-h-[52px] px-6 py-3 text-base",
    xl: "min-h-[60px] px-8 py-4 text-lg",
  };
  
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 focus:ring-blue-500 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 dark:shadow-blue-500/30",
    secondary:
      "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 focus:ring-cyan-500 dark:shadow-cyan-500/30",
    tertiary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105 hover:shadow-md focus:ring-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 focus:ring-red-500 dark:shadow-red-500/30",
    ghost: 
      "text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 focus:ring-blue-400",
    outline:
      "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:scale-105 hover:shadow-md focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20",
  };
  
  return (
    <button
      type={type}
      className={cn(
        base,
        sizes[size] || sizes.md,
        variants[variant] || variants.primary,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className="relative z-10">{children}</span>
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="absolute inset-0 bg-white/10" />
      </span>
    </button>
  );
}
