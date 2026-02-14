import { cn } from "@/lib/utils";

export function Card({ 
  children, 
  className = "", 
  variant = "default",
  hoverable = false,
  ...props 
}) {
  const variants = {
    default:
      "rounded-xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800",
    elevated:
      "rounded-xl border border-slate-200/60 bg-white shadow-lg hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-800 dark:shadow-blue-900/10",
    glass:
      "rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-lg dark:border-slate-700/50 dark:bg-slate-800/80 dark:backdrop-blur-sm",
    gradient:
      "rounded-xl border border-transparent bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md dark:from-slate-800 dark:to-blue-900/20",
  };

  const hoverEffect = hoverable 
    ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 cursor-pointer" 
    : "transition-shadow duration-200";

  return (
    <div
      className={cn(
        variants[variant] || variants.default,
        hoverEffect,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={cn(
        "border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/60 sm:px-6 sm:py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={cn("p-4 sm:p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-slate-200/60 px-4 py-3 dark:border-slate-700/60 sm:px-6 sm:py-4",
        className
      )}
    >
      {children}
    </div>
  );
}
