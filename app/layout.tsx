import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://bildout.com'),
  title: 'BildOut - Your work. Billed out.',
  description: 'Simple billing for builders, contractors, and small businesses. From quote to paid invoice, BildOut streamlines how you close out every job.',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B1YVXBJ9M6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B1YVXBJ9M6');
          `}
        </Script>

        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
