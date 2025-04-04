"use client";

import { WalletDropdown } from "./WalletDropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-terminal-border bg-terminal-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between py-4">
        <div className="font-mono text-lg font-bold">
          <span className="text-primary glitch">Waku Keystore</span>{" "}
          <span className="text-foreground opacity-80">Management</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <WalletDropdown />
        </div>
      </div>
    </header>
  );
} 