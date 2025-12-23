"use client";

import { BookOpen, Shield, Lock, Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="glass mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <span className="font-bold gradient-text">Crystal Keys</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure, encrypted book rights management powered by homomorphic encryption.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                <Lock className="w-4 h-4 text-purple-400" />
                Encrypted Licensing
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                <Shield className="w-4 h-4 text-cyan-400" />
                Secure Distribution
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                <BookOpen className="w-4 h-4 text-pink-400" />
                Rights Management
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">API Reference</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Smart Contracts</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:border-purple-500/50 transition-colors">
                <Github className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:border-purple-500/50 transition-colors">
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by Zama FHEVM
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Crystal Keys. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
