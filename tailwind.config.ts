import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        link: {
          DEFAULT: "hsl(var(--link))",
          foreground: "hsl(var(--link-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        textBase: "hsl(var(--text-base))",
        textMuted: "hsl(var(--text-muted))",
        textLight: "hsl(var(--text-light))",
        textLink: "hsl(var(--text-link))",
        headingColor: "hsl(var(--heading-color))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'glow': '0 0 10px 2px hsl(var(--primary)/30%), 0 0 4px 0px hsl(var(--primary)/20%)',
        'card-hover': '0 10px 30px -10px hsl(var(--primary)/10%), 0 4px 10px -3px hsl(var(--primary)/15%)',
        'floating': '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "gradient-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 4s ease-in-out infinite",
        "gradient-flow": "gradient-flow 15s ease infinite"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'hsl(var(--text-base))',
            '[class~="lead"]': {
              color: 'hsl(var(--text-muted))',
            },
            a: {
              color: 'hsl(var(--text-link))',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'hsl(var(--heading-color))',
              fontWeight: '600',
            },
            h1: {
              color: 'hsl(var(--heading-color))',
              fontWeight: '800',
            },
            h2: {
              color: 'hsl(var(--heading-color))',
              fontWeight: '700',
            },
            h3: {
              color: 'hsl(var(--heading-color))',
              fontWeight: '600',
            },
            h4: {
              color: 'hsl(var(--heading-color))',
              fontWeight: '600',
            },
            code: {
              color: 'hsl(var(--text-base))',
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '0.25rem',
              paddingLeft: '0.35rem',
              paddingRight: '0.35rem',
              paddingTop: '0.1rem',
              paddingBottom: '0.1rem',
              fontFamily: 'var(--font-mono)',
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--border))',
              color: 'hsl(var(--text-muted))',
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
