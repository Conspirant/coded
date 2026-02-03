# 📰 News Automation System

This guide explains how to automate the news section in your KCET Compass dashboard.

## 🚀 Quick Start

### 1. Basic News Fetching
```bash
# Fetch news from Reddit and other sources
npm run fetch:news

# Advanced version with RSS feeds and News API
npm run fetch:news:advanced
```

### 2. Webhook Server (Real-time updates)
```bash
# Start webhook server for external triggers
npm run news:webhook
```

## 📋 Available Solutions

### **1. Reddit Integration (Recommended)**
- **File**: `scripts/fetch-news.mjs`
- **Sources**: r/kcet, r/Btechtards, r/JEE, r/EngineeringAdmissions
- **Features**:
  - Fetches hot posts from multiple subreddits
  - Filters for KCET/engineering related content
  - Sorts by Reddit score
  - Auto-generates thumbnails using Reddit oEmbed

### **2. Advanced Multi-Source Integration**
- **File**: `scripts/fetch-news-advanced.mjs`
- **Sources**: Reddit + RSS Feeds + News API + Static News
- **Features**:
  - RSS feed parsing for official sources
  - News API integration (requires API key)
  - Priority-based sorting
  - Duplicate detection

### **3. GitHub Actions (Automatic Daily Updates)**
- **File**: `.github/workflows/update-news.yml`
- **Schedule**: Daily at 6 AM UTC
- **Features**:
  - Automatic commits and pushes
  - Manual trigger option
  - Environment variable support

### **4. Webhook Server (Real-time)**
- **File**: `scripts/news-webhook.mjs`
- **Port**: 3001 (configurable)
- **Features**:
  - HTTP endpoint for external triggers
  - Secret-based authentication
  - CORS support

## 🔧 Configuration

### Environment Variables
```bash
# For News API integration
NEWS_API_KEY=your_api_key_here

# For webhook server
PORT=3001
WEBHOOK_SECRET=your_secret_key
```

### Customizing News Sources
Edit the configuration in `scripts/fetch-news-advanced.mjs`:

```javascript
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
      }
    ]
  },
  newsApi: {
    apiKey: process.env.NEWS_API_KEY || '',
    sources: ['the-times-of-india', 'the-hindu'],
    keywords: ['KCET', 'engineering admission', 'college counselling']
  }
}
```

## 📊 News Data Structure

Each news item follows this structure:
```json
{
  "id": "unique-identifier",
  "title": "News title",
  "image": "image-url-or-auto",
  "url": "source-url",
  "source": "Source name",
  "publishedAt": "YYYY-MM-DD",
  "type": "reddit|rss|newsapi|static"
}
```

## 🛠️ Setup Instructions

### 1. Basic Setup (Reddit Only)
```bash
# Run once to test
npm run fetch:news

# Check the generated news.json
cat public/data/news.json
```

### 2. Advanced Setup (Multi-source)
```bash
# Get a free News API key from https://newsapi.org/
export NEWS_API_KEY=your_key_here

# Run advanced fetcher
npm run fetch:news:advanced
```

### 3. GitHub Actions Setup
1. Push the workflow file to your repository
2. Go to Settings → Secrets and variables → Actions
3. Add `NEWS_API_KEY` if using News API
4. The workflow will run automatically daily

### 4. Webhook Setup
```bash
# Start webhook server
npm run news:webhook

# Test webhook (in another terminal)
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-secret-key"}'
```

## 🔄 Automation Options

### **Option 1: GitHub Actions (Recommended)**
- ✅ Free
- ✅ Automatic daily updates
- ✅ No server required
- ✅ Version controlled

### **Option 2: Cron Job (Local/Server)**
```bash
# Add to crontab
0 6 * * * cd /path/to/your/project && npm run fetch:news
```

### **Option 3: Webhook + External Scheduler**
- Use services like cron-job.org
- Call your webhook endpoint
- Real-time updates

### **Option 4: Manual Updates**
```bash
# Run when needed
npm run fetch:news
```

## 🎯 Customization Ideas

### 1. Add More Sources
- **Twitter/X**: Use Twitter API for KCET-related tweets
- **YouTube**: Fetch KCET-related videos
- **Telegram**: Monitor KCET channels
- **WhatsApp**: Web scraping from groups (if public)

### 2. Content Filtering
```javascript
// Add more keywords for better filtering
const keywords = [
  'kcet', 'engineering', 'college', 'admission', 
  'counselling', 'rank', 'cutoff', 'seat matrix',
  'karnataka', 'btech', 'engineering admission'
]
```

### 3. Image Enhancement
- Use AI services to generate relevant images
- Implement image caching
- Add fallback images for different news types

### 4. Notification System
- Send notifications when new important news is found
- Integrate with Discord/Slack webhooks
- Email notifications for critical updates

## 🚨 Troubleshooting

### Common Issues

1. **Reddit API Rate Limiting**
   - Add delays between requests
   - Use Reddit API with authentication

2. **RSS Feed Issues**
   - Check if feeds are accessible
   - Verify XML parsing

3. **News API Quota**
   - Free tier has 1000 requests/day
   - Consider caching responses

4. **GitHub Actions Failures**
   - Check workflow logs
   - Verify file permissions
   - Ensure secrets are set correctly

### Debug Mode
```bash
# Add debug logging
DEBUG=true npm run fetch:news
```

## 📈 Monitoring

### Check News Quality
```bash
# View current news
cat public/data/news.json | jq '.[] | {title, source, publishedAt}'
```

### Monitor Updates
```bash
# Watch for changes
watch -n 5 'ls -la public/data/news.json'
```

## 🔗 Useful Resources

- [Reddit API Documentation](https://www.reddit.com/dev/api/)
- [News API](https://newsapi.org/)
- [RSS Feed Validator](https://validator.w3.org/feed/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Contributing

To add new news sources or improve the system:

1. Fork the repository
2. Add your changes to the scripts
3. Test with `npm run fetch:news`
4. Submit a pull request

---

**💡 Pro Tip**: Start with the basic Reddit integration and gradually add more sources as needed. The system is designed to be modular and extensible!
