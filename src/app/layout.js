import { Geist, Geist_Mono } from "next/font/google";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Antrenman Programı Yönetimi",
  description: "Spor salonu antrenman programları yönetim uygulaması",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `
(function() {
  var key = 'admin-theme';
  var stored = localStorage.getItem(key);
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var dark = stored === 'dark' || (stored !== 'light' && prefersDark);
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} antialiased`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              classNames: {
                toast:
                  "rounded-xl border border-slate-200 shadow-lg dark:border-slate-700",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
