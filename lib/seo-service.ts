// SEO数据服务 - 分离SEO逻辑
import { DataService } from './data-service'
import { getCurrentSiteConfig } from '@/config/default-settings'
import type { Metadata } from 'next'

export interface SeoSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  siteLogo: string
  favicon: string
  keywords: string[]
  author: string
  twitterHandle: string
  ogImage: string
  ogTitle: string
  ogDescription: string
  canonicalUrl?: string
  metaTags: {
    viewport: string
    themeColor: string
    appleMobileWebAppTitle?: string
    appleMobileWebAppCapable?: string
  }
  googleAnalyticsId?: string
  googleSearchConsoleId?: string
  yandexWebmasterToolsId?: string
  baiduWebmasterToolsId?: string
  customHeadTags?: string
}

export interface GamePageSeoConfig {
  titleTemplate: string
  descriptionTemplate: string
  keywordsTemplate: string
  enableBreadcrumbs?: boolean
  enableRichSnippets?: boolean
  enableOpenGraph?: boolean
  enableTwitterCards?: boolean
}

export interface CategoryPageSeoConfig {
  titleTemplate: string
  descriptionTemplate: string
  keywordsTemplate: string
  enablePagination?: boolean
}

export interface HeadingStructureConfig {
  homepage?: {
    h1?: string
    h2?: string
    h3?: string
  }
  gamePage?: {
    h1?: string
    h2?: string
    h3?: string
  }
  categoryPage?: {
    h1?: string
    h2?: string
    h3?: string
  }
}

export interface SeoData {
  seoSettings: SeoSettings
  gamePageSEO?: GamePageSeoConfig
  categoryPageSEO?: CategoryPageSeoConfig
  headingStructure?: HeadingStructureConfig
}

function buildDefaultSeoData(): SeoData {
  const defaultConfig = getCurrentSiteConfig()

  return {
    seoSettings: {
      siteName: defaultConfig.siteName,
      siteDescription: defaultConfig.siteDescription,
      siteUrl: defaultConfig.siteUrl,
      siteLogo: defaultConfig.siteLogo || '/placeholder-logo.png',
      favicon: defaultConfig.favicon || '/favicon.ico',
      keywords: defaultConfig.keywords || ['online games', 'browser games', 'free games'],
      author: defaultConfig.author,
      twitterHandle: defaultConfig.twitterHandle,
      ogImage: defaultConfig.ogImage || '/og-image.png',
      ogTitle: `${defaultConfig.siteName} - Best Free Online Games`,
      ogDescription: defaultConfig.siteDescription,
      canonicalUrl: defaultConfig.siteUrl,
      metaTags: {
        viewport: defaultConfig.metaTags?.viewport || 'width=device-width, initial-scale=1.0',
        themeColor: defaultConfig.metaTags?.themeColor || '#475569',
        appleMobileWebAppTitle: defaultConfig.metaTags?.appleMobileWebAppTitle,
        appleMobileWebAppCapable: defaultConfig.metaTags?.appleMobileWebAppCapable,
      },
      googleAnalyticsId: undefined,
      googleSearchConsoleId: undefined,
      yandexWebmasterToolsId: undefined,
      baiduWebmasterToolsId: undefined,
      customHeadTags: undefined,
    },
    gamePageSEO: {
      titleTemplate: '{gameName} - Play Free Online | {siteName}',
      descriptionTemplate: 'Play {gameName} for free online! {gameDescription} No download required - start playing now!',
      keywordsTemplate: '{gameName}, {category}, free game, online game, browser game',
      enableBreadcrumbs: true,
      enableRichSnippets: true,
      enableOpenGraph: true,
      enableTwitterCards: true,
    },
    categoryPageSEO: {
      titleTemplate: '{categoryName} Games - Free Online | {siteName}',
      descriptionTemplate: 'Play the best {categoryName} games for free! Discover hundreds of exciting {categoryName} games.',
      keywordsTemplate: '{categoryName} games, free {categoryName}, online {categoryName}',
      enablePagination: true,
    },
    headingStructure: {
      homepage: {
        h1: '{siteName} - Best Free Online Games',
        h2: 'Featured Games',
        h3: 'Game Categories',
      },
      gamePage: {
        h1: '{gameName}',
        h2: 'About This Game',
        h3: 'Game Features',
      },
      categoryPage: {
        h1: '{categoryName} Games',
        h2: 'Popular {categoryName} Games',
        h3: 'Latest {categoryName} Games',
      },
    },
  }
}

function mergeSeoData(rawData: any): SeoData {
  const defaults = buildDefaultSeoData()
  const mergedSeoSettings = {
    ...defaults.seoSettings,
    ...(rawData?.seoSettings || {}),
    metaTags: {
      ...defaults.seoSettings.metaTags,
      ...(rawData?.seoSettings?.metaTags || {}),
    },
  }

  return {
    seoSettings: mergedSeoSettings,
    gamePageSEO: {
      ...defaults.gamePageSEO,
      ...(rawData?.gamePageSEO || {}),
    },
    categoryPageSEO: {
      ...defaults.categoryPageSEO,
      ...(rawData?.categoryPageSEO || {}),
    },
    headingStructure: {
      ...defaults.headingStructure,
      ...(rawData?.headingStructure || {}),
    },
  }
}

function safeCreateUrl(value?: string): URL | undefined {
  if (!value) return undefined
  try {
    return new URL(value)
  } catch (error) {
    console.warn('Invalid URL provided in SEO settings:', value, error)
    return undefined
  }
}

export class SeoService {
  static getDefaultSeoData(): SeoData {
    return buildDefaultSeoData()
  }

  static async getSeoData(): Promise<SeoData> {
    try {
      const data = await DataService.getSeoSettings()
      return mergeSeoData(data)
    } catch (error) {
      console.error('Failed to load SEO settings:', error)
      return buildDefaultSeoData()
    }
  }

  static async generateMetadata(): Promise<Metadata> {
    try {
      const { seoSettings } = await this.getSeoData()

      const metadataBase = safeCreateUrl(seoSettings.siteUrl)
      const canonical = seoSettings.canonicalUrl || seoSettings.siteUrl
      const canonicalUrl = canonical || getCurrentSiteConfig().siteUrl

      return {
        title: seoSettings.siteName,
        description: seoSettings.siteDescription,
        keywords: seoSettings.keywords,
        authors: [{ name: seoSettings.author }],
        generator: 'Next.js',
        ...(metadataBase ? { metadataBase } : {}),
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          title: seoSettings.ogTitle || seoSettings.siteName,
          description: seoSettings.ogDescription || seoSettings.siteDescription,
          url: canonicalUrl,
          siteName: seoSettings.siteName,
          images: [{
            url: seoSettings.ogImage,
            width: 1200,
            height: 630,
            alt: seoSettings.siteName,
          }],
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: seoSettings.ogTitle || seoSettings.siteName,
          description: seoSettings.ogDescription || seoSettings.siteDescription,
          site: seoSettings.twitterHandle,
          images: [seoSettings.ogImage],
        },
        icons: {
          icon: seoSettings.favicon,
          apple: seoSettings.siteLogo,
        },
        other: {
          'theme-color': seoSettings.metaTags.themeColor,
          ...(seoSettings.metaTags.appleMobileWebAppTitle && {
            'apple-mobile-web-app-title': seoSettings.metaTags.appleMobileWebAppTitle
          }),
          ...(seoSettings.metaTags.appleMobileWebAppCapable && {
            'mobile-web-app-capable': seoSettings.metaTags.appleMobileWebAppCapable
          }),
          ...(seoSettings.googleSearchConsoleId && {
            'google-site-verification': seoSettings.googleSearchConsoleId
          }),
        }
      }
    } catch (error) {
      console.error('Failed to generate metadata:', error)
      
      // 返回安全的默认metadata
      const defaultConfig = getCurrentSiteConfig()
      return {
        title: defaultConfig.siteName,
        description: defaultConfig.siteDescription,
        generator: 'Next.js',
        metadataBase: new URL(defaultConfig.siteUrl),
        alternates: {
          canonical: defaultConfig.siteUrl,
        },
      }
    }
  }
  
  static async getAnalyticsId(): Promise<string | null> {
    try {
      const { seoSettings } = await this.getSeoData()
      
      // 只返回安全的GA ID，拒绝自定义脚本
      const gaId = seoSettings.googleAnalyticsId
      if (gaId && gaId.startsWith('G-') && gaId.length > 10) {
        return gaId
      }
      
      return null
    } catch (error) {
      console.error('Failed to get analytics ID:', error)
      return null
    }
  }
  
  static async getVerificationTags(): Promise<{
    yandex?: string
    baidu?: string
  }> {
    try {
      const { seoSettings } = await this.getSeoData()
      
      return {
        ...(seoSettings.yandexWebmasterToolsId && { yandex: seoSettings.yandexWebmasterToolsId }),
        ...(seoSettings.baiduWebmasterToolsId && { baidu: seoSettings.baiduWebmasterToolsId })
      }
    } catch (error) {
      console.error('Failed to get verification tags:', error)
      return {}
    }
  }

  static async getCustomHeadTags(): Promise<string | null> {
    try {
      const { seoSettings } = await this.getSeoData()
      
      const customTags = seoSettings.customHeadTags
      console.log('[DEBUG] Custom tags from settings:', customTags)
      if (!customTags || customTags.trim() === '') {
        console.log('[DEBUG] No custom tags found')
        return null
      }
      
      // 基本的安全检查 - 确保是合法的分析和验证代码
      const allowedDomains = [
        'plausible',
        'analytics.google.com',
        'googletagmanager.com', 
        'googlesyndication.com',
        'google-analytics.com',
        'hotjar.com',
        'mixpanel.com',
        'segment.com',
        'facebook.com',
        'twitter.com'
      ]
      
      const hasAllowedDomain = allowedDomains.some(domain => 
        customTags.toLowerCase().includes(domain.toLowerCase())
      )
      console.log('[DEBUG] Has allowed domain:', hasAllowedDomain)
      
      // 检查危险内容
      const dangerousPatterns = [
        'javascript:',
        'data:',
        'vbscript:',
        'onload=',
        'onerror=',
        'onclick=',
        'eval(',
        'document.write('
      ]
      
      const hasDangerousContent = dangerousPatterns.some(pattern =>
        customTags.toLowerCase().includes(pattern.toLowerCase())
      )
      console.log('[DEBUG] Has dangerous content:', hasDangerousContent)
      
      if (hasDangerousContent) {
        console.warn('Custom head tags rejected: contains dangerous content')
        return null
      }
      
      const hasScriptDefer = customTags.includes('<script defer')
      const hasScriptAsync = customTags.includes('<script async')
      const hasMeta = customTags.includes('<meta ')
      console.log('[DEBUG] Has script defer:', hasScriptDefer, 'Has script async:', hasScriptAsync, 'Has meta:', hasMeta)
      
      // 如果包含允许的域名或者看起来是标准的meta标签，则允许
      if (hasAllowedDomain || hasMeta || hasScriptDefer || hasScriptAsync) {
        console.log('[DEBUG] Custom head tags approved')
        return customTags
      }
      
      console.warn('Custom head tags rejected: no recognized analytics domain')
      return null
      
    } catch (error) {
      console.error('Failed to get custom head tags:', error)
      return null
    }
  }
}
