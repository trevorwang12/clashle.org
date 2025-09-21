import { NextResponse } from 'next/server'
import { SeoService } from '@/lib/seo-service'

export async function GET() {
  try {
    const seoData = await SeoService.getSeoData()
    return NextResponse.json(seoData)
  } catch (error) {
    console.error('Error fetching SEO data:', error)
    return NextResponse.json(SeoService.getDefaultSeoData(), { status: 200 })
  }
}
