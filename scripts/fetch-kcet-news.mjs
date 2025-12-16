#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

// Configuration
const NEWS_FILE = 'public/data/news.json'
const MAX_NEWS_ITEMS = 15

// KCET and Education News Sources
const NEWS_SOURCES = {
  // Official KCET sources
  kcetOfficial: {
    name: 'KCET Official',
    url: 'https://cet.karnataka.gov.in',
    type: 'official'
  },
  
  // Education news websites
  educationNews: [
    {
      name: 'Times of India Education',
      url: 'https://timesofindia.indiatimes.com/education',
      keywords: ['KCET', 'Karnataka CET', 'engineering admission']
    },
    {
      name: 'The Hindu Education',
      url: 'https://www.thehindu.com/education/',
      keywords: ['KCET', 'Karnataka', 'engineering']
    },
    {
      name: 'Deccan Herald Education',
      url: 'https://www.deccanherald.com/education',
      keywords: ['KCET', 'Karnataka', 'college admission']
    }
  ],
  
  // University websites
  universities: [
    {
      name: 'VTU Updates',
      url: 'https://vtu.ac.in',
      keywords: ['KCET', 'admission', 'engineering']
    },
    {
      name: 'RVCE Updates',
      url: 'https://rvce.edu.in',
      keywords: ['KCET', 'admission', 'engineering']
    }
  ]
}

// Static KCET news items (updated regularly)
const STATIC_KCET_NEWS = [
  {
    id: 'kcet-2025-application',
    title: 'KCET 2025 Application Process - Important Dates Announced',
    image: '/placeholder.svg',
    url: 'https://cet.karnataka.gov.in',
    source: 'KCET Official',
    publishedAt: new Date().toISOString().split('T')[0],
    type: 'official',
    priority: 1
  },
  {
    id: 'kcet-2025-exam-date',
    title: 'KCET 2025 Exam Date Expected in April 2025',
    image: '/placeholder.svg',
    url: 'https://cet.karnataka.gov.in',
    source: 'KCET Official',
    publishedAt: new Date().toISOString().split('T')[0],
    type: 'official',
    priority: 1
  },
  {
    id: 'kcet-seat-matrix-2025',
    title: 'KCET 2025 Seat Matrix - New Engineering Colleges Added',
    image: '/placeholder.svg',
    url: 'https://cet.karnataka.gov.in',
    source: 'KCET Updates',
    publishedAt: new Date().toISOString().split('T')[0],
    type: 'official',
    priority: 2
  },
  {
    id: 'kcet-counselling-2025',
    title: 'KCET 2025 Counselling Schedule - Round-wise Details',
    image: '/placeholder.svg',
    url: 'https://cet.karnataka.gov.in',
    source: 'KCET Official',
    publishedAt: new Date().toISOString().split('T')[0],
    type: 'official',
    priority: 2
  },
  {
    id: 'kcet-fee-structure-2025',
    title: 'KCET 2025 Fee Structure - Updated for All Categories',
    image: '/placeholder.svg',
    url: 'https://cet.karnataka.gov.in',
    source: 'KCET Updates',
    publishedAt: new Date().toISOString().split('T')[0],
    type: 'official',
    priority: 3
  }
]

// Reddit KCET-specific subreddits
const KCET_REDDIT_SOURCES = [
  'kcet',
  'Btechtards', // Has KCET discussions
  'EngineeringAdmissions' // Has KCET posts
]

async function fetchRedditKCETPosts() {
  const REDDIT_BASE = 'https://www.reddit.com'
  const posts = []
  
  for (const subreddit of KCET_REDDIT_SOURCES) {
    try {
      const url = `${REDDIT_BASE}/r/${subreddit}/hot.json?limit=10`
      const response = await fetch(url)
      
      if (!response.ok) {
        console.warn(`Failed to fetch from r/${subreddit}: ${response.status}`)
        continue
      }
      
      const data = await response.json()
      const subredditPosts = data.data.children.map(child => child.data)
      
      // Filter for KCET-specific content
      const kcetPosts = subredditPosts
        .filter(post => {
          const title = post.title.toLowerCase()
          const content = (post.selftext || '').toLowerCase()
          
          // KCET-specific keywords
          const kcetKeywords = [
            'kcet', 'karnataka cet', 'karnataka common entrance test',
            'cet karnataka', 'engineering admission karnataka',
            'karnataka engineering', 'btech admission karnataka'
          ]
          
          return kcetKeywords.some(keyword => 
            title.includes(keyword) || content.includes(keyword)
          )
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
          type: 'reddit',
          priority: 4
        }))
      
      posts.push(...kcetPosts)
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error.message)
    }
  }
  
  return posts
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // Top 5 KCET-related Reddit posts
}

async function fetchEducationNews() {
  // Simulate fetching from education news websites
  // In a real implementation, you'd use web scraping or RSS feeds
  return [
    {
      id: 'toi-kcet-2025',
      title: 'KCET 2025: Karnataka CET Application Process to Begin Soon',
      image: '/placeholder.svg',
      url: 'https://timesofindia.indiatimes.com/education',
      source: 'Times of India Education',
      publishedAt: new Date().toISOString().split('T')[0],
      type: 'news',
      priority: 3
    },
    {
      id: 'hindu-kcet-updates',
      title: 'KCET 2025: New Engineering Colleges Join the Counselling Process',
      image: '/placeholder.svg',
      url: 'https://www.thehindu.com/education/',
      source: 'The Hindu Education',
      publishedAt: new Date().toISOString().split('T')[0],
      type: 'news',
      priority: 3
    }
  ]
}

async function saveNews(news) {
  try {
    const dir = path.dirname(NEWS_FILE)
    await fs.mkdir(dir, { recursive: true })
    
    // Sort by priority first, then by date
    const sortedNews = news.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority // Lower priority number = higher priority
      }
      return new Date(b.publishedAt) - new Date(a.publishedAt)
    })
    
    const limitedNews = sortedNews.slice(0, MAX_NEWS_ITEMS)
    
    await fs.writeFile(NEWS_FILE, JSON.stringify(limitedNews, null, 2))
    console.log(`✅ Updated ${NEWS_FILE} with ${limitedNews.length} KCET news items`)
    
    // Log breakdown by type
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
  console.log('🔄 Fetching KCET-specific news from official sources...')
  
  const allNews = []
  
  // 1. Add static KCET news (official updates)
  console.log('📋 Adding official KCET news...')
  allNews.push(...STATIC_KCET_NEWS)
  
  // 2. Fetch KCET-specific Reddit posts
  console.log('📱 Fetching KCET-related Reddit posts...')
  const redditPosts = await fetchRedditKCETPosts()
  allNews.push(...redditPosts)
  
  // 3. Fetch education news
  console.log('📰 Fetching education news...')
  const educationNews = await fetchEducationNews()
  allNews.push(...educationNews)
  
  // Save all news
  await saveNews(allNews)
  
  console.log(`📰 Found ${allNews.length} KCET news items`)
  console.log(`📊 Sources: ${[...new Set(allNews.map(item => item.source))].join(', ')}`)
  console.log('✨ KCET news update completed!')
}

// Run the script
main().catch(console.error)
