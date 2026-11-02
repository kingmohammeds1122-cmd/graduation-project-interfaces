import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة ذكاء الأعمال والذكاء الاصطناعي | Enterprise BI & AI Platform",
  description: "منصة التحليلات واستنطاق البيانات المؤسسية بالذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${ibmPlexSansArabic.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const cookieTheme = document.cookie.match(/(?:^|;\\s*)enterprise_theme=([^;]+)/)?.[1];
                  const localTheme = localStorage.getItem('enterprise_theme');
                  const theme = cookieTheme || localTheme;
                  const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  const mode = isDark ? 'dark' : 'light';
                  document.documentElement.classList.toggle('dark', isDark);
                  document.documentElement.setAttribute('data-theme', mode);
                  document.documentElement.style.colorScheme = mode;
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAFC] text-slate-900 dark:bg-[#070B19] dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <SidebarProvider>
            <AuthProvider>{children}</AuthProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
