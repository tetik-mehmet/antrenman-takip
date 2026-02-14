"use client";

import { cn } from "@/lib/utils";

function EyeIcon({ open = false, className }) {
  if (open) {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

export default function Input({
  label,
  id,
  type = "text",
  error,
  className = "",
  labelClassName = "",
  showPassword,
  onToggleShowPassword,
  ...props
}) {
  const isPassword = type === "password";
  const showToggle = isPassword && typeof onToggleShowPassword === "function";
  const inputType = isPassword && showPassword ? "text" : type;

  const baseInputClasses =
    "w-full min-h-[44px] rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:bg-slate-800 dark:text-slate-100";
  const defaultFocus =
    "border-slate-300 focus:border-blue-500 focus:ring-blue-500/50 hover:border-slate-400 dark:border-slate-600 dark:focus:border-blue-400 dark:focus:ring-blue-400/50 dark:hover:border-slate-500";
  const errorFocus =
    "border-red-500 focus:border-red-500 focus:ring-red-500/50 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/50";
  const withPadding = showToggle ? "pr-11" : "";

  const inputEl = (
    <input
      id={id}
      type={inputType}
      className={cn(
        baseInputClasses,
        error ? errorFocus : defaultFocus,
        withPadding,
        className
      )}
      {...props}
    />
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      {showToggle ? (
        <div className="relative">
          {inputEl}
          <button
            type="button"
            onClick={onToggleShowPassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-slate-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
            tabIndex={-1}
            title={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            <EyeIcon open={showPassword} className="h-5 w-5" />
          </button>
        </div>
      ) : (
        inputEl
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
