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
  themeColor: "#000000",
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
    <html lang="en" className="dark bg-black">
      <body className="bg-black text-white antialiased min-h-screen selection:bg-apple-blue selection:text-white">
        <main className="min-h-screen flex flex-col bg-black">
          {children}
        </main>
      </body>
    </html>
  );
}
