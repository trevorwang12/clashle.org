import type { Metadata } from 'next'
import NewGamesClient from './NewGamesClient'
import { getCurrentSiteConfig } from '@/config/default-settings'
import { SeoService } from '@/lib/seo-service'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await SeoService.getSeoData()
  const { seoSettings } = seoData
  
  const title = `New Games - ${seoSettings?.siteName || 'GAMES'}`
  const description = 'Discover the latest and newest games! Play fresh games added to our collection.'
  const defaultConfig = getCurrentSiteConfig()
  const pageUrl = `${(seoSettings?.siteUrl || defaultConfig.siteUrl).replace(/\/$/, '')}/new-games`
  
  return {
    title,
    description,
    keywords: ['new games', 'latest games', 'fresh games', 'online games', 'browser games'],
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
        alt: 'New Games - Latest Online Games',
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

export default async function NewGamesPage() {
  const { seoSettings } = await SeoService.getSeoData()
  return <NewGamesClient initialSeoSettings={seoSettings} />
}
