#!/usr/bin/env node

import { createServer } from 'http'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const PORT = process.env.PORT || 3001
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key'

// Validate required environment variables
if (WEBHOOK_SECRET === 'your-secret-key') {
  console.warn('⚠️  Warning: Using default webhook secret. Please set WEBHOOK_SECRET environment variable for production.');
}

async function updateNews() {
  try {
    console.log('🔄 Triggering news update via webhook...')
    const { stdout, stderr } = await execAsync('npm run fetch:news')
    
    if (stderr) {
      console.error('Error updating news:', stderr)
      return { success: false, error: stderr }
    }
    
    console.log('✅ News updated successfully:', stdout)
    return { success: true, message: 'News updated successfully' }
  } catch (error) {
    console.error('❌ Failed to update news:', error.message)
    return { success: false, error: error.message }
  }
}

const server = createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  if (req.method === 'POST') {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        
        // Verify webhook secret
        if (data.secret !== WEBHOOK_SECRET) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Unauthorized' }))
          return
        }
        
        const result = await updateNews()
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
  } else if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      status: 'News webhook server running',
      endpoints: {
        'POST /': 'Trigger news update (requires secret)',
        'GET /': 'Server status'
      }
    }))
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
  }
})

server.listen(PORT, () => {
  console.log(`🚀 News webhook server running on port ${PORT}`)
  console.log(`📡 Webhook URL: http://localhost:${PORT}`)
  console.log(`🔑 Secret: ${WEBHOOK_SECRET}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down webhook server...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})
