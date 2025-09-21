import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'
import { getCurrentSiteConfig } from '@/config/default-settings'
import { SeoService } from '@/lib/seo-service'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await SeoService.getSeoData()
  const { seoSettings } = seoData
  
  const title = `About Us - ${seoSettings?.siteName || 'GAMES'}`
  const description = 'Learn about our mission to provide the best free online gaming experience. Discover our story and values.'
  const defaultConfig = getCurrentSiteConfig()
  const pageUrl = `${(seoSettings?.siteUrl || defaultConfig.siteUrl).replace(/\/$/, '')}/about`
  
  return {
    title,
    description,
    keywords: ['about us', 'gaming platform', 'online games', 'mission', 'values'],
    authors: [{ name: seoSettings?.author || 'Gaming Platform' }],
    robots: 'index, follow',
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: seoSettings?.siteName || 'GAMES',
      images: [{
        url: seoSettings?.ogImage || '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About Us - Gaming Platform',
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [seoSettings?.ogImage || '/og-image.png'],
      site: seoSettings?.twitterHandle || '@rule34dle',
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

export default async function AboutPage() {
  const { seoSettings } = await SeoService.getSeoData()
  return <AboutPageClient initialSeoSettings={seoSettings} />
}
