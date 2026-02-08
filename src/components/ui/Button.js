import { cn } from "@/lib/utils";

export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary:
      "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500",
    secondary:
      "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400",
  };
  return (
    <button
      type={type}
      className={cn(base, variants[variant] || variants.primary, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
