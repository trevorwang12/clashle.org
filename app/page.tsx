import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'
import { SeoService } from '@/lib/seo-service'

export async function generateMetadata(): Promise<Metadata> {
  return SeoService.generateMetadata()
}

export default async function HomePage() {
  const seoData = await SeoService.getSeoData()
  return <HomePageClient initialSeoData={seoData} />
}
