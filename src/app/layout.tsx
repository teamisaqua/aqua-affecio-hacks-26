import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFFECIO — Chemistry Lab",
  description: "Don't just match. Discover your chemistry. An interactive connection experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="liquid-mesh-background min-h-screen text-slate-100 antialiased selection:bg-lab-cyan/30 selection:text-white">
        {/* Subtle Ambient Depth Lighting */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-lab-purple/15 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-lab-cyan/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-lab-pink/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>

        <main className="relative z-10 min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
