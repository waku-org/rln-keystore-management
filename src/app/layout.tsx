import "./globals.css";
import { Inter as FontSans, JetBrains_Mono as FontMono } from "next/font/google";
import { cn } from "../lib/utils";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";

import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";

import {  WalletProvider, RLNImplementationProvider, KeystoreProvider, RLNProvider } from "../contexts/index";
import { Header } from "../components/Header";
import { AppStateProvider } from "../contexts/AppStateContext";
import { Footer } from "@/components/Footer";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Waku Keystore Management",
  description: "A simple application to manage Waku RLN keystores",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
          "circuit-bg"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="waku-keystore-theme"
        >
          <AppStateProvider>
            <WalletProvider>
              <RLNImplementationProvider>
                <KeystoreProvider>
                  <RLNProvider>
                    <div className="relative flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1 container mx-auto py-8">
                        {children}
                      </main>
                      <Footer />
                    </div>
                    <Toaster />
                  </RLNProvider>
                </KeystoreProvider>
              </RLNImplementationProvider>
            </WalletProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}