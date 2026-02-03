import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface NewsStatusProps {
  className?: string
}

interface NewsItem {
  id: string
  title: string
  image: string
  url: string
  source: string
  publishedAt: string
}

interface NewsStats {
  totalItems: number
  lastUpdated: string
  sources: string[]
  newItems: number
}

export function NewsStatus({ className }: NewsStatusProps) {
  const [stats, setStats] = useState<NewsStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastFetch, setLastFetch] = useState<string>('')

  const loadNewsStats = async () => {
    try {
      const response = await fetch('/data/news.json')
      if (!response.ok) throw new Error('Failed to load news')
      
      const news: NewsItem[] = await response.json()
      const sources = [...new Set(news.map((item) => item.source))]
      
      setStats({
        totalItems: news.length,
        lastUpdated: new Date().toISOString(),
        sources,
        newItems: news.filter((item: NewsItem) => {
          const itemDate = new Date(item.publishedAt)
          const today = new Date()
          const diffDays = (today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
          return diffDays <= 1
        }).length
      })
    } catch (error) {
      console.error('Error loading news stats:', error)
    }
  }

  const triggerNewsUpdate = async () => {
    setLoading(true)
    try {
      // This would call your webhook endpoint if deployed
      // For now, just reload the stats
      await loadNewsStats()
      setLastFetch(new Date().toLocaleString())
    } catch (error) {
      console.error('Error updating news:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNewsStats()
  }, [])

  if (!stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            News Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          News Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.newItems}</div>
            <div className="text-xs text-muted-foreground">New Today</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Last Updated: {new Date(stats.lastUpdated).toLocaleString()}</span>
          </div>
          
          {lastFetch && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Last Fetch: {lastFetch}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Sources:</div>
          <div className="flex flex-wrap gap-1">
            {stats.sources.slice(0, 3).map((source) => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
            {stats.sources.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{stats.sources.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={triggerNewsUpdate}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Update News
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 News updates automatically via GitHub Actions daily at 6 AM UTC
        </div>
      </CardContent>
    </Card>
  )
}
