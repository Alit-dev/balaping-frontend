/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "#E2E8F0",
                input: "#E2E8F0",
                ring: "#2563EB",
                background: "#FFFFFF",
                foreground: "#0F172A",
                primary: {
                    DEFAULT: "#2563EB",
                    hover: "#1D4ED8",
                    foreground: "#FFFFFF",
                    50: "#EFF6FF",
                    100: "#DBEAFE",
                    200: "#BFDBFE",
                    300: "#93C5FD",
                    400: "#60A5FA",
                    500: "#2563EB",
                    600: "#1D4ED8",
                    700: "#1E40AF",
                    800: "#1E3A8A",
                    900: "#1E293B",
                },
                success: {
                    DEFAULT: "#10B981",
                    foreground: "#FFFFFF",
                    50: "#DCFCE7",
                    100: "#BBF7D0",
                    500: "#10B981",
                    600: "#059669",
                },
                danger: {
                    DEFAULT: "#EF4444",
                    foreground: "#FFFFFF",
                    50: "#FEE2E2",
                    100: "#FECACA",
                    500: "#EF4444",
                    600: "#DC2626",
                },
                warning: {
                    DEFAULT: "#F59E0B",
                    foreground: "#FFFFFF",
                    50: "#FEF3C7",
                    100: "#FDE68A",
                    500: "#F59E0B",
                    600: "#D97706",
                },
                surface: "#F8FAFC",
                text: {
                    primary: "#0F172A",
                    secondary: "#64748B",
                    muted: "#94A3B8",
                },
                muted: {
                    DEFAULT: "#F8FAFC",
                    foreground: "#64748B",
                },
                popover: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
                accent: {
                    DEFAULT: "#2563EB",
                    foreground: "#FFFFFF",
                },
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
            },
            borderRadius: {
                sm: "6px",
                md: "8px",
                lg: "12px",
                xl: "16px",
                full: "9999px",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            },
            boxShadow: {
                soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
                medium: "0 8px 30px rgba(0, 0, 0, 0.08)",
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "slide-down": "slideDown 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideDown: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
}
