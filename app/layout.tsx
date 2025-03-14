import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Coin Flip Tool - Make Random Decisions",
  description:
    "A virtual coin flip tool for making random decisions. Flip a virtual coin with realistic animation and sound effects.",
  keywords: "coin flip, virtual coin, heads or tails, random decision, coin toss",
  openGraph: {
    title: "Coin Flip Tool - Make Random Decisions",
    description: "A virtual coin flip tool for making random decisions",
    url: "https://coin-flip-tool.vercel.app",
    siteName: "Coin Flip Tool",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Coin Flip Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coin Flip Tool - Make Random Decisions",
    description: "A virtual coin flip tool for making random decisions",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Coin Flip Tool",
              description: "A virtual coin flip tool for making random decisions",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
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



import './globals.css'