"use client";

import "./globals.css";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Providers = dynamic(() => import("./providers").then(mod => mod.Providers), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased animated-bg min-h-screen">
        {/* Soft Floating Particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="particle" style={{ top: '8%', left: '12%', animationDelay: '0s' }} />
          <div className="particle" style={{ top: '22%', left: '78%', animationDelay: '1.5s' }} />
          <div className="particle" style={{ top: '55%', left: '18%', animationDelay: '3s' }} />
          <div className="particle" style={{ top: '75%', left: '68%', animationDelay: '4.5s' }} />
          <div className="particle" style={{ top: '38%', left: '88%', animationDelay: '6s' }} />
          <div className="particle-crystal" style={{ top: '12%', left: '30%', animationDelay: '0.8s' }} />
          <div className="particle-crystal" style={{ top: '65%', left: '82%', animationDelay: '3.2s' }} />
          <div className="particle-crystal" style={{ top: '42%', left: '8%', animationDelay: '5.5s' }} />
          <div className="particle-crystal" style={{ top: '82%', left: '45%', animationDelay: '2s' }} />
        </div>
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
