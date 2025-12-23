"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BookOpen, Sparkles, Shield } from "lucide-react";

export const Header = () => {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Soft Logo */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-300 via-pink-200 to-blue-300 p-0.5 shadow-lg shadow-purple-200/50">
                <div className="w-full h-full rounded-2xl bg-white/90 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Crystal Keys
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-400" />
                Encrypted Rights Distribution
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 mr-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-purple-600 transition-colors font-medium">
              Marketplace
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-purple-600 transition-colors font-medium">
              Publisher
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-purple-600 transition-colors font-medium">
              Docs
            </a>
          </nav>

          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
