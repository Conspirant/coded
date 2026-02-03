#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

// Configuration
const NEWS_FILE = 'public/data/news.json'
const REDDIT_SUBREDDITS = ['kcet', 'Btechtards', 'JEE', 'EngineeringAdmissions']
const MAX_POSTS_PER_SUBREDDIT = 5
const MAX_DAYS_OLD = 30

// Reddit API endpoints (using JSON endpoints - no auth required for public data)
const REDDIT_BASE = 'https://www.reddit.com'

async function fetchRedditPosts(subreddit) {
  try {
    const url = `${REDDIT_BASE}/r/${subreddit}/hot.json?limit=${MAX_POSTS_PER_SUBREDDIT}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.warn(`Failed to fetch from r/${subreddit}: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    const posts = data.data.children.map(child => child.data)
    
    return posts
      .filter(post => {
        // Filter out stickied posts, mod posts, and very old posts
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
        comments: post.num_comments
      }))
  } catch (error) {
    console.error(`Error fetching from r/${subreddit}:`, error.message)
    return []
  }
}

async function fetchEducationNews() {
  // You can integrate with news APIs here
  // For now, returning some static education-related news
  return [
    {
      id: 'education-1',
      title: 'KCET 2025 Application Process Updates',
      image: '/placeholder.svg',
      url: 'https://cet.karnataka.gov.in',
      source: 'KCET Official',
      publishedAt: new Date().toISOString().split('T')[0]
    },
    {
      id: 'education-2', 
      title: 'New Engineering Colleges Added to KCET 2025',
      image: '/placeholder.svg',
      url: 'https://cet.karnataka.gov.in',
      source: 'KCET Updates',
      publishedAt: new Date().toISOString().split('T')[0]
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
    // Ensure directory exists
    const dir = path.dirname(NEWS_FILE)
    await fs.mkdir(dir, { recursive: true })
    
    // Sort by date (newest first)
    const sortedNews = news.sort((a, b) => 
      new Date(b.publishedAt) - new Date(a.publishedAt)
    )
    
    // Take only the latest 10 news items
    const limitedNews = sortedNews.slice(0, 10)
    
    await fs.writeFile(NEWS_FILE, JSON.stringify(limitedNews, null, 2))
    console.log(`✅ Updated ${NEWS_FILE} with ${limitedNews.length} news items`)
  } catch (error) {
    console.error('Error saving news:', error)
  }
}

async function main() {
  console.log('🔄 Fetching latest news...')
  
  // Fetch Reddit posts from multiple subreddits
  const redditPromises = REDDIT_SUBREDDITS.map(subreddit => fetchRedditPosts(subreddit))
  const redditResults = await Promise.all(redditPromises)
  
  // Flatten and filter Reddit posts
  const redditPosts = redditResults
    .flat()
    .filter(post => {
      // Filter for KCET/engineering related content
      const keywords = ['kcet', 'engineering', 'college', 'admission', 'counselling', 'rank', 'cutoff']
      const title = post.title.toLowerCase()
      return keywords.some(keyword => title.includes(keyword))
    })
    .sort((a, b) => b.score - a.score) // Sort by Reddit score
    .slice(0, 8) // Take top 8 Reddit posts
  
  // Fetch education news
  const educationNews = await fetchEducationNews()
  
  // Combine all news
  const allNews = [...redditPosts, ...educationNews]
  
  // Load existing news to avoid duplicates
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
}

// Run the script
main().catch(console.error)
