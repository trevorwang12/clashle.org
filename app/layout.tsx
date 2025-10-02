import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import HydrationErrorBoundary from '@/components/HydrationErrorBoundary'
import HydrationFix from '@/components/HydrationFix'
import SafePreloadManager from '@/components/optimization/SafePreloadManager'
import SafeAnalytics from '@/components/SafeAnalytics'
import SafeVerificationTags from '@/components/SafeVerificationTags'
import SafeCustomHeadTags from '@/components/SafeCustomHeadTags'
import { SeoService } from '@/lib/seo-service'
import './globals.css'

// "Simplicity is the ultimate sophistication." - Leonardo (Linus would approve)
export async function generateMetadata(): Promise<Metadata> {
  return SeoService.generateMetadata()
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Performance Optimization Headers */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="preconnect" href="https://plausibleonline.top" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="//plausibleonline.top" />
        
        {/* Content Security Policy */}
        <meta httpEquiv="Content-Security-Policy" content="
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://partner.googleadservices.com https://plausibleonline.top;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://adservice.google.com;
          font-src 'self' https://fonts.gstatic.com;
          img-src 'self' data: https: http:;
          frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
          connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://plausibleonline.top;
        " />
        
        {/* Favicon and Icon declarations */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        <SafeAnalytics />
        <SafeVerificationTags />
        <SafeCustomHeadTags />
        
        {/* 关键CSS内联 - 减少CLS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body { 
                margin: 0; 
                padding: 0; 
                font-display: swap;
                -webkit-text-size-adjust: 100%;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              .max-w-7xl { max-width: 80rem; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .px-4 { padding-left: 1rem; padding-right: 1rem; }
              .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
              .mb-8 { margin-bottom: 2rem; }
              .mt-12 { margin-top: 3rem; }
              .aspect-ratio-4-3 { aspect-ratio: 4/3; }
              footer { height: auto; min-height: 200px; }
              .font-sans { font-display: swap; }
              img { 
                max-width: 100%; 
                height: auto;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
              }
              .grid { display: grid; }
              .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
              .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
              @media (min-width: 640px) {
                .sm\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
              }
              @media (min-width: 768px) {
                .md\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
              }
              * { will-change: auto; }
              .group:hover .group-hover\\:scale-105 {
                transform: scale(1.05);
              }
            `,
          }}
        />
      </head>
      <body 
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning={true}
      >
        <div id="__next" suppressHydrationWarning={true}>
          <HydrationErrorBoundary>
            <HydrationFix />
            <SafePreloadManager />
            {children}
          </HydrationErrorBoundary>
        </div>
      </body>
    </html>
  )
}