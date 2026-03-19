import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Geist } from "next/font/google";
import "./globals.css"
import { cn } from "@/lib/utils";
import { SearchDocsProvider } from "@/context/search-docs-context";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const siteUrl = "https://fold.fivexlabs.com"
const siteName = "FivFold"
const siteDescription =
  "Full-stack Kits built on shadcn/ui. Drop in a complete email client or kanban board in minutes, with matching Express or NestJS backends."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Full-stack Kits`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "kit",
    "shadcn ui",
    "react components",
    "nextjs",
    "typescript",
    "tailwind css",
    "email client",
    "kanban board",
    "express",
    "nestjs",
    "typeorm",
    "fivfold",
    "fivexlabs",
  ],
  authors: [{ name: "Fivex Labs", url: "https://fivexlabs.com" }],
  creator: "Fivex Labs",
  publisher: "Fivex Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} — Full-stack Kits`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "FivFold — Full-stack Kits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Full-stack Kits`,
    description: siteDescription,
    creator: "@fivexlabs",
    images: [`${siteUrl}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#030303",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", spaceGrotesk.className, "font-sans", geist.variable)}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FivFold",
              description: siteDescription,
              url: siteUrl,
              applicationCategory: "DeveloperApplication",
              author: {
                "@type": "Organization",
                name: "Fivex Labs",
                url: "https://fivexlabs.com",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <SearchDocsProvider>{children}</SearchDocsProvider>
      </body>
    </html>
  )
}
