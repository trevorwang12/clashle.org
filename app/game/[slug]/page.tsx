import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GamePageClient from './GamePageClient'
import gamesData from '@/data/games.json'
import { getCurrentSiteConfig } from '@/config/default-settings'
import { SeoService } from '@/lib/seo-service'

interface PageProps {
  params: { slug: string }
}

interface GameData {
  id: string
  name: string
  description: string
  thumbnailUrl: string
  category: string
  tags: string[]
  rating: number
  playCount: number
  viewCount: number
  developer?: string
  releaseDate: string
  addedDate: string
  isActive: boolean
  isFeatured: boolean
  gameType: string
  gameUrl?: string
}

function getGameById(gameId: string): GameData | null {
  const games = gamesData as GameData[]
  return games.find(game => game.id === gameId && game.isActive) || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 直接从静态数据获取游戏
  const game = getGameById(params.slug)
  
  if (!game) {
    return {
      title: 'Game Not Found - GAMES',
      description: 'Sorry, the game you are looking for could not be found.',
    }
  }
  
  // 获取SEO配置
  const seoData = await SeoService.getSeoData()
  const { seoSettings, gamePageSEO } = seoData
  
  // 生成动态标题
  const title = gamePageSEO?.titleTemplate
    ?.replace('{gameName}', game.name)
    ?.replace('{siteName}', seoSettings?.siteName || 'GAMES') || `${game.name} - Play Free Online | GAMES`
    
  // 生成动态描述
  const description = gamePageSEO?.descriptionTemplate
    ?.replace('{gameName}', game.name)
    ?.replace('{gameDescription}', game.description || '') || `Play ${game.name} for free online! No download required.`
    
  // 生成动态关键词
  const keywords = gamePageSEO?.keywordsTemplate
    ?.replace('{gameName}', game.name)
    ?.replace('{category}', game.category || 'game') || `${game.name}, free game, online game`
  
  const fallbackSiteUrl = seoSettings?.siteUrl || getCurrentSiteConfig().siteUrl
  const gameUrl = `${(fallbackSiteUrl || '').replace(/\/$/, '')}/game/${params.slug}`
  
  // 生成结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": game.name,
    "description": game.description || description,
    "url": gameUrl,
    "image": game.thumbnailUrl || '/placeholder-game.webp',
    "genre": game.category,
    "playMode": "SinglePlayer",
    "applicationCategory": "Game",
    "publisher": {
      "@type": "Organization",
      "name": seoSettings?.siteName || "GAMES"
    }
  }
  
  return {
    title,
    description,
    keywords: keywords.split(', '),
    authors: [{ name: seoSettings?.author || 'Gaming Platform' }],
    robots: 'index, follow',
    openGraph: {
      title,
      description,
      url: gameUrl,
      siteName: seoSettings?.siteName || 'GAMES',
      images: [{
        url: game.thumbnailUrl || seoSettings?.ogImage || '/placeholder-game.webp',
        width: 1200,
        height: 630,
        alt: `${game.name} - Play Online Free`,
      }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [game.thumbnailUrl || seoSettings?.ogImage || '/placeholder-game.webp'],
      site: seoSettings?.twitterHandle || '@rule34dle',
    },
    alternates: {
      canonical: gameUrl,
    },
    other: {
      'application-ld+json': JSON.stringify(jsonLd)
    }
  }
}

export default async function GamePage({ params }: PageProps) {
  // 直接从静态数据获取游戏
  const game = getGameById(params.slug)
  
  if (!game) {
    notFound()
  }

  const seoData = await SeoService.getSeoData()

  return (
    <>
      {/* 服务端渲染的SEO标签，对搜索引擎可见 */}
      <div style={{ display: 'none' }}>
        <h1>{game.name}</h1>
        <h2>About This Game</h2>
        <h2>Game Features</h2>
      </div>
      <GamePageClient params={params} initialSeoSettings={seoData.seoSettings} />
    </>
  )
}
