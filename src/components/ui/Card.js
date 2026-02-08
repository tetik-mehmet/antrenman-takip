import { cn } from "@/lib/utils";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800",
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
        "border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6 sm:py-4",
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
        "flex items-center gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6 sm:py-4",
        className
      )}
    >
      {children}
    </div>
  );
}
