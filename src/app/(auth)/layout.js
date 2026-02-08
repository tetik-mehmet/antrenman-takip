export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen w-full font-[family-name:var(--font-manrope),sans-serif]"
      style={{ fontFamily: "var(--font-manrope), sans-serif" }}
    >
      {children}
    </div>
  );
}
