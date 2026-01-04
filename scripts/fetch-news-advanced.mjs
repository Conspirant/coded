#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

// Configuration
const NEWS_FILE = 'public/data/news.json'
const MAX_NEWS_ITEMS = 15
const MAX_DAYS_OLD = 30

// News sources configuration
const NEWS_SOURCES = {
  reddit: {
    subreddits: ['kcet', 'Btechtards', 'JEE', 'EngineeringAdmissions'],
    maxPosts: 5
  },
  rss: {
    feeds: [
      {
        name: 'KCET Official',
        url: 'https://cet.karnataka.gov.in/feed/',
        keywords: ['kcet', 'admission', 'counselling']
      },
      {
        name: 'Times of India Education',
        url: 'https://timesofindia.indiatimes.com/rss/education.cms',
        keywords: ['engineering', 'college', 'admission']
      }
    ]
  },
  newsApi: {
    // You can get a free API key from https://newsapi.org/
    apiKey: process.env.NEWS_API_KEY || '',
    sources: ['the-times-of-india', 'the-hindu'],
    keywords: ['KCET', 'engineering admission', 'college counselling']
  }
}

async function fetchRedditPosts(subreddit, maxPosts) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${maxPosts}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KCET-Compass-News-Bot/1.0'
      }
    })
    
    if (!response.ok) {
      console.warn(`Failed to fetch from r/${subreddit}: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    const posts = data.data.children.map(child => child.data)
    
    return posts
      .filter(post => {
        const postDate = new Date(post.created_utc * 1000)
        const daysOld = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24)
        return !post.stickied && !post.distinguished && daysOld <= MAX_DAYS_OLD
      })
      .map(post => ({
        id: `reddit-${post.id}`,
        title: post.title,
        image: post.thumbnail && post.thumbnail !== 'self' ? post.thumbnail : 'auto',
        url: `https://www.reddit.com${post.permalink}`,
        source: `Reddit r/${subreddit}`,
        publishedAt: new Date(post.created_utc * 1000).toISOString().split('T')[0],
        score: post.score,
        comments: post.num_comments,
        type: 'reddit'
      }))
  } catch (error) {
    console.error(`Error fetching from r/${subreddit}:`, error.message)
    return []
  }
}

async function fetchRSSFeed(feed) {
  try {
    const response = await fetch(feed.url)
    if (!response.ok) {
      console.warn(`Failed to fetch RSS from ${feed.name}: ${response.status}`)
      return []
    }
    
    const text = await response.text()
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')
    
    const items = xml.querySelectorAll('item')
    const news = []
    
    for (const item of items) {
      const title = item.querySelector('title')?.textContent || ''
      const link = item.querySelector('link')?.textContent || ''
      const pubDate = item.querySelector('pubDate')?.textContent || ''
      const description = item.querySelector('description')?.textContent || ''
      
      // Check if content matches keywords
      const content = `${title} ${description}`.toLowerCase()
      const matchesKeywords = feed.keywords.some(keyword => 
        content.includes(keyword.toLowerCase())
      )
      
      if (matchesKeywords) {
        const publishedAt = new Date(pubDate).toISOString().split('T')[0]
        const daysOld = (Date.now() - new Date(pubDate).getTime()) / (1000 * 60 * 60 * 24)
        
        if (daysOld <= MAX_DAYS_OLD) {
          news.push({
            id: `rss-${Buffer.from(link).toString('base64').slice(0, 10)}`,
            title: title,
            image: '/placeholder.svg',
            url: link,
            source: feed.name,
            publishedAt: publishedAt,
            type: 'rss'
          })
        }
      }
    }
    
    return news.slice(0, 5) // Limit to 5 items per feed
  } catch (error) {
    console.error(`Error fetching RSS from ${feed.name}:`, error.message)
    return []
  }
}

async function fetchNewsAPI() {
  if (!NEWS_SOURCES.newsApi.apiKey) {
    console.log('⚠️  NEWS_API_KEY not set, skipping News API')
    return []
  }
  
  try {
    const query = NEWS_SOURCES.newsApi.keywords.join(' OR ')
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sources=${NEWS_SOURCES.newsApi.sources.join(',')}&sortBy=publishedAt&apiKey=${NEWS_SOURCES.newsApi.apiKey}`
    
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`News API error: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    
    return data.articles
      .filter(article => {
        const daysOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
        return daysOld <= MAX_DAYS_OLD
      })
      .map(article => ({
        id: `newsapi-${Buffer.from(article.url).toString('base64').slice(0, 10)}`,
        title: article.title,
        image: article.urlToImage || '/placeholder.svg',
        url: article.url,
        source: article.source.name,
        publishedAt: new Date(article.publishedAt).toISOString().split('T')[0],
        type: 'newsapi'
      }))
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching from News API:', error.message)
    return []
  }
}

async function fetchStaticNews() {
  // Static news items for important updates
  return [
    {
      id: 'static-kcet-updates',
      title: 'KCET 2025 Application Process - Latest Updates',
      image: '/placeholder.svg',
      url: 'https://cet.karnataka.gov.in',
      source: 'KCET Official',
      publishedAt: new Date().toISOString().split('T')[0],
      type: 'static'
    },
    {
      id: 'static-college-updates',
      title: 'New Engineering Colleges Added to KCET 2025 Seat Matrix',
      image: '/placeholder.svg',
      url: 'https://cet.karnataka.gov.in',
      source: 'KCET Updates',
      publishedAt: new Date().toISOString().split('T')[0],
      type: 'static'
    }
  ]
}

async function loadExistingNews() {
  try {
    const data = await fs.readFile(NEWS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.log('No existing news file found, starting fresh')
    return []
  }
}

async function saveNews(news) {
  try {
    const dir = path.dirname(NEWS_FILE)
    await fs.mkdir(dir, { recursive: true })
    
    // Sort by date (newest first) and type priority
    const sortedNews = news.sort((a, b) => {
      const dateComparison = new Date(b.publishedAt) - new Date(a.publishedAt)
      if (dateComparison !== 0) return dateComparison
      
      // Priority: static > newsapi > rss > reddit
      const priority = { static: 4, newsapi: 3, rss: 2, reddit: 1 }
      return (priority[b.type] || 0) - (priority[a.type] || 0)
    })
    
    const limitedNews = sortedNews.slice(0, MAX_NEWS_ITEMS)
    
    await fs.writeFile(NEWS_FILE, JSON.stringify(limitedNews, null, 2))
    console.log(`✅ Updated ${NEWS_FILE} with ${limitedNews.length} news items`)
    
    // Log summary
    const typeCounts = limitedNews.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {})
    
    console.log('📊 News breakdown:', typeCounts)
  } catch (error) {
    console.error('Error saving news:', error)
  }
}

async function main() {
  console.log('🔄 Fetching latest news from multiple sources...')
  
  const allNews = []
  
  // Fetch Reddit posts
  console.log('📱 Fetching Reddit posts...')
  const redditPromises = NEWS_SOURCES.reddit.subreddits.map(subreddit => 
    fetchRedditPosts(subreddit, NEWS_SOURCES.reddit.maxPosts)
  )
  const redditResults = await Promise.all(redditPromises)
  const redditPosts = redditResults
    .flat()
    .filter(post => {
      const keywords = ['kcet', 'engineering', 'college', 'admission', 'counselling', 'rank', 'cutoff']
      const title = post.title.toLowerCase()
      return keywords.some(keyword => title.includes(keyword))
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
  
  allNews.push(...redditPosts)
  
  // Fetch RSS feeds
  console.log('📰 Fetching RSS feeds...')
  const rssPromises = NEWS_SOURCES.rss.feeds.map(feed => fetchRSSFeed(feed))
  const rssResults = await Promise.all(rssPromises)
  const rssPosts = rssResults.flat()
  allNews.push(...rssPosts)
  
  // Fetch News API
  console.log('🌐 Fetching News API...')
  const newsApiPosts = await fetchNewsAPI()
  allNews.push(...newsApiPosts)
  
  // Add static news
  console.log('📋 Adding static news...')
  const staticNews = await fetchStaticNews()
  allNews.push(...staticNews)
  
  // Load existing news and merge
  const existingNews = await loadExistingNews()
  const existingIds = new Set(existingNews.map(item => item.id))
  
  // Filter out duplicates
  const newNews = allNews.filter(item => !existingIds.has(item.id))
  
  // Combine existing and new news
  const combinedNews = [...existingNews, ...newNews]
  
  // Save updated news
  await saveNews(combinedNews)
  
  console.log(`📰 Found ${newNews.length} new news items`)
  console.log(`📊 Total news items: ${combinedNews.length}`)
  console.log('✨ News update completed!')
}

// Run the script
main().catch(console.error)
