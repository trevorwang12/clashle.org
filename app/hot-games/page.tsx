import type { Metadata } from 'next'
import HotGamesClient from './HotGamesClient'
import { getCurrentSiteConfig } from '@/config/default-settings'
import { SeoService } from '@/lib/seo-service'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await SeoService.getSeoData()
  const { seoSettings } = seoData
  
  const title = `Hot Games - ${seoSettings?.siteName || 'GAMES'}`
  const description = 'Play the hottest and most popular games! Discover trending games that everyone is playing.'
  const defaultConfig = getCurrentSiteConfig()
  const pageUrl = `${(seoSettings?.siteUrl || defaultConfig.siteUrl).replace(/\/$/, '')}/hot-games`
  
  return {
    title,
    description,
    keywords: ['hot games', 'popular games', 'trending games', 'online games', 'browser games'],
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
        alt: 'Hot Games - Most Popular Online Games',
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [seoSettings?.ogImage || '/og-image.png'],
      site: seoSettings?.twitterHandle || defaultConfig.twitterHandle,
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

export default async function HotGamesPage() {
  const { seoSettings } = await SeoService.getSeoData()
  return <HotGamesClient initialSeoSettings={seoSettings} />
}
