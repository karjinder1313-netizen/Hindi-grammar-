/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)',
                        xl: '0.75rem',
                        '2xl': '1rem',
                        full: '9999px'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))',
                                hover: 'hsl(var(--card-hover))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))',
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))',
                                glow: 'hsl(var(--primary-glow))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))',
                                light: 'hsl(var(--secondary-light))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))',
                                light: 'hsl(var(--accent-light))'
                        },
                        success: {
                                DEFAULT: 'hsl(var(--success))',
                                foreground: 'hsl(var(--success-foreground))'
                        },
                        warning: {
                                DEFAULT: 'hsl(var(--warning))',
                                foreground: 'hsl(var(--warning-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                fontFamily: {
                        hindi: 'var(--font-hindi)',
                        english: 'var(--font-english)'
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
                        'float': {
                                '0%, 100%': { transform: 'translateY(0px)' },
                                '50%': { transform: 'translateY(-20px)' }
                        },
                        'slide-up': {
                                from: {
                                        opacity: '0',
                                        transform: 'translateY(30px)'
                                },
                                to: {
                                        opacity: '1',
                                        transform: 'translateY(0)'
                                }
                        },
                        'fade-in': {
                                from: { opacity: '0' },
                                to: { opacity: '1' }
                        },
                        'scale-in': {
                                from: {
                                        opacity: '0',
                                        transform: 'scale(0.9)'
                                },
                                to: {
                                        opacity: '1',
                                        transform: 'scale(1)'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'float': 'float 3s ease-in-out infinite',
                        'slide-up': 'slide-up 0.6s ease-out forwards',
                        'fade-in': 'fade-in 0.5s ease-out forwards',
                        'scale-in': 'scale-in 0.4s ease-out forwards'
                },
                boxShadow: {
                        'sm': 'var(--shadow-sm)',
                        'md': 'var(--shadow-md)',
                        'lg': 'var(--shadow-lg)',
                        'glow': 'var(--shadow-glow)'
                },
                transitionTimingFunction: {
                        'smooth': 'var(--transition-smooth)',
                        'spring': 'var(--transition-spring)'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};