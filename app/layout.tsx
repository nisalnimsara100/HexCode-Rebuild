import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/auth-context"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HexCode - Modern Software Solutions",
  description:
    "Innovative software development company specializing in cutting-edge web applications and digital solutions.",
  generator: "HexCode",
  keywords: ["software development", "web applications", "digital solutions", "technology"],
  authors: [{ name: "HexCode Team" }],
  creator: "HexCode",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
