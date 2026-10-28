import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFFECIO — Chemistry Lab",
  description: "Don't just match. Discover your chemistry. An interactive connection experience.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Affecio",
  },
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="apple-lab-canvas min-h-screen text-[#f5f5f7] antialiased selection:bg-sky-500/30 selection:text-white">
        <main className="relative z-10 min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
