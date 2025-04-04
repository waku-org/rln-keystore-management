import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        // Cypherpunk inspired color palette
        background: "hsl(230, 25%, 7%)", // Deep space background
        foreground: "hsl(213, 31%, 91%)",
        
        border: "hsl(230, 15%, 20%)",
        input: "hsl(230, 15%, 15%)",
        
        // Base accent colors
        primary: {
          DEFAULT: "hsl(150, 100%, 54%)", // Neon green
          foreground: "hsl(230, 25%, 7%)",
          muted: "hsla(150, 100%, 54%, 0.2)",
        },
        secondary: {
          DEFAULT: "hsl(280, 100%, 60%)", // Electric purple
          foreground: "hsl(230, 25%, 7%)",
          muted: "hsla(280, 100%, 60%, 0.2)",
        },
        accent: {
          DEFAULT: "hsl(190, 100%, 50%)", // Digital blue
          foreground: "hsl(230, 25%, 7%)",
          muted: "hsla(190, 100%, 50%, 0.2)",
        },
        
        // Status colors
        success: {
          DEFAULT: "hsl(142, 76%, 50%)",
          muted: "hsla(142, 76%, 50%, 0.2)",
        },
        warning: {
          DEFAULT: "hsl(38, 100%, 50%)",
          muted: "hsla(38, 100%, 50%, 0.2)",
        },
        destructive: {
          DEFAULT: "hsl(0, 100%, 55%)",
          muted: "hsla(0, 100%, 55%, 0.2)",
          foreground: "hsl(210, 40%, 98%)",
        },
        
        // UI component colors
        muted: {
          DEFAULT: "hsl(230, 15%, 25%)",
          foreground: "hsl(213, 20%, 65%)",
        },
        card: {
          DEFAULT: "hsl(229, 20%, 10%)",
          foreground: "hsl(213, 31%, 91%)",
        },
        popover: {
          DEFAULT: "hsl(229, 20%, 10%)",
          foreground: "hsl(213, 31%, 91%)",
        },
        
        // Specialized elements
        terminal: {
          background: "hsl(230, 25%, 5%)",
          border: "hsl(150, 100%, 54%, 0.3)",
          text: "hsl(150, 100%, 54%)",
          muted: "hsl(150, 100%, 25%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      boxShadow: {
        glow: "0 0 10px var(--tw-shadow-color), 0 0 20px var(--tw-shadow-color)",
        "glow-sm": "0 0 5px var(--tw-shadow-color), 0 0 10px var(--tw-shadow-color)",
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "terminal-typing": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "5%, 25%, 75%, 95%": { opacity: "0.8" },
          "10%, 30%, 80%, 90%": { opacity: "0.9" },
          "15%, 45%, 65%, 85%": { opacity: "0.85" },
          "20%, 40%, 60%, 70%": { opacity: "0.75" },
        },
      },
      animation: {
        "scan-line": "scan-line 6s linear infinite",
        blink: "blink 1s step-end infinite",
        "terminal-typing": "terminal-typing 3s steps(40, end)",
        flicker: "flicker 5s linear infinite",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;
