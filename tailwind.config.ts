import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface system
        bg: {
          base: "#0A0A0B",
          surface: "#16181D",
          elevated: "#1C1F26",
          hover: "#22262E",
        },
        // Text
        fg: {
          primary: "#F4F5F7",
          secondary: "#B8BCC4",
          muted: "#8B8F97",
          subtle: "#5C616B",
        },
        // Neon accents (data viz palette)
        neon: {
          cyan: "#00E5FF",
          magenta: "#FF2D9C",
          lime: "#A6FF4D",
          purple: "#A855F7",
          amber: "#FFB020",
          red: "#FF4D6D",
        },

        // shadcn-style aliases (now dark)
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.08)",
        ring: "#00E5FF",
        background: "#0A0A0B",
        foreground: "#F4F5F7",
        muted: {
          DEFAULT: "#16181D",
          foreground: "#8B8F97",
        },
        primary: {
          DEFAULT: "#00E5FF",
          foreground: "#0A0A0B",
        },
        secondary: {
          DEFAULT: "#1C1F26",
          foreground: "#F4F5F7",
        },
        destructive: {
          DEFAULT: "#FF4D6D",
          foreground: "#0A0A0B",
        },
        accent: {
          DEFAULT: "#1C1F26",
          foreground: "#F4F5F7",
        },
        card: {
          DEFAULT: "#16181D",
          foreground: "#F4F5F7",
        },

        // Legacy sourci-* names kept so old class strings still resolve
        sourci: {
          primary: "#00E5FF",
          accent: "#1C1F26",
          success: "#A6FF4D",
          warning: "#FFB020",
          danger: "#FF4D6D",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.875rem",
        md: "0.625rem",
        sm: "0.375rem",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        "card-hover":
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 12px 32px -10px rgba(0,0,0,0.7)",
        "glow-cyan": "0 0 24px rgba(0,229,255,0.35)",
        "glow-magenta": "0 0 24px rgba(255,45,156,0.35)",
        "glow-lime": "0 0 24px rgba(166,255,77,0.35)",
        "glow-amber": "0 0 24px rgba(255,176,32,0.35)",
        "glow-red": "0 0 24px rgba(255,77,109,0.4)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
