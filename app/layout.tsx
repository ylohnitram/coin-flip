import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Coin Flip | Random Decision Maker App",
  description: "A virtual coin flip app for making random decisions quickly. Customizable coins with statistics tracking and offline support.",
  keywords: "coin flip, random decision, heads or tails, coin toss app, decision maker, PWA, offline app",
  authors: [{ name: "Your Name" }],
  category: "Tools",
  applicationName: "Coin Flip Tool",
  generator: "Next.js",
  colorScheme: "dark light",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Coin Flip Tool - Make Random Decisions",
    description: "A virtual coin flip tool with customizable coins, statistics tracking, and offline support.",
    url: "https://toss.cool",
    siteName: "Coin Flip Tool",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Coin Flip App Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coin Flip Tool - Make Random Decisions",
    description: "A virtual coin flip tool with customizable coins, statistics tracking, and offline support.",
    creator: "@your_twitter",
    images: ["/og-image.jpg"],
  },
  alternates: {
    languages: {
      'en-US': 'https://toss.cool',
      'cs-CZ': 'https://toss.cool/cs'
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preload" href="/coin-flip.mp3" as="audio" />
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Coin Flip Tool",
              "description": "A virtual coin flip tool for making random decisions with customizable coins, statistics tracking, and offline support.",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "featureList": [
                "Virtual coin flip simulation",
                "Customizable coin appearance",
                "Multiple coin flips at once",
                "Statistics tracking",
                "Offline functionality",
                "Dark/light mode",
                "Sound effects"
              ],
              "screenshot": "https://toss.cool/screenshots/app-screenshot.jpg",
              "softwareVersion": "1.0.0",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "120"
              }
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
