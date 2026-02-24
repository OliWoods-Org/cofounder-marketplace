'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Badge {
  id: string
  name: string
  icon: string
  description: string
}

interface LeaderboardEntry {
  rank: number
  builderId: string
  clerkUserId: string
  totalRevenue: string
  totalDownloads: number
  totalAgents: number
  avgRating: string | null
  totalReviews: number
  badges: string[]
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  badges: Record<string, Badge>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  sortBy: string
}

const SORT_OPTIONS = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'downloads', label: 'Downloads' },
  { value: 'rating', label: 'Rating' },
  { value: 'agents', label: 'Agents Published' },
]

function BadgeIcon({ badge, badges }: { badge: string; badges: Record<string, Badge> }) {
  const badgeInfo = badges[badge]
  if (!badgeInfo) return null

  const iconMap: Record<string, React.ReactElement> = {
    trophy: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 1a3 3 0 013 3v2.382a3 3 0 01-.879 2.121l-1.83 1.83A6 6 0 0010 18a6 6 0 00-.291-7.667l-1.83-1.83A3 3 0 017 6.382V4a3 3 0 013-3zm-2 4v2.382a1 1 0 00.293.707L10 9.797l1.707-1.708A1 1 0 0012 7.382V5a1 1 0 00-1-1H9a1 1 0 00-1 1z" clipRule="evenodd" />
      </svg>
    ),
    fire: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
    'check-badge': (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    star: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    stack: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
      </svg>
    ),
  }

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-medium"
      title={badgeInfo.description}
    >
      {iconMap[badgeInfo.icon] || null}
      <span>{badgeInfo.name}</span>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-lg shadow-yellow-500/25">
        1
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold shadow-lg shadow-gray-400/25">
        2
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-600/25">
        3
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-full bg-glass-200 flex items-center justify-center text-gray-400 font-medium">
      {rank}
    </div>
  )
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('revenue')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/leaderboard?sortBy=${sortBy}`)
        const result = await response.json()
        if (!response.ok) {
          setError(result.error || 'Failed to load leaderboard')
          return
        }
        setData(result)
      } catch {
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [sortBy])

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh-gradient">
      <div className="mesh-gradient" />

      {/* Navigation */}
      <nav className="border-b border-glass-200 bg-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-accent-primary transition-colors">Marketplace</Link>
              <span>/</span>
              <span className="text-white">Leaderboard</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Builder Leaderboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Top builders ranked by revenue, downloads, and ratings. Create agents and climb the ranks!
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-center gap-2 mb-8">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === option.value
                  ? 'bg-accent-primary text-white'
                  : 'bg-glass-100 text-gray-400 hover:text-white hover:bg-glass-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-panel p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-glass-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-glass-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-glass-200 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-accent-primary hover:text-accent-secondary"
            >
              Try again
            </button>
          </div>
        ) : data?.leaderboard.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-gray-400">No builders yet. Be the first!</p>
            <Link href="/dashboard/create" className="btn-primary mt-4 inline-block">
              Create Your First Agent
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.leaderboard.map((entry) => (
              <div
                key={entry.builderId}
                className={`glass-panel p-6 transition-all hover:bg-glass-200 ${
                  entry.rank <= 3 ? 'border border-accent-gold/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <RankBadge rank={entry.rank} />

                  {/* Builder Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        Builder {entry.clerkUserId.slice(0, 8)}...
                      </span>
                      {entry.badges.map((badge) => (
                        <BadgeIcon
                          key={badge}
                          badge={badge}
                          badges={data.badges}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{entry.totalAgents} agent{entry.totalAgents !== 1 ? 's' : ''}</span>
                      {entry.avgRating && parseFloat(entry.avgRating) > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {parseFloat(entry.avgRating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-sm text-gray-400">Downloads</p>
                      <p className="text-lg font-semibold text-white">
                        {entry.totalDownloads.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Revenue</p>
                      <p className="text-lg font-semibold blue-text">
                        ${parseFloat(entry.totalRevenue).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg ${
                  page === data.pagination.page
                    ? 'bg-accent-primary text-white'
                    : 'bg-glass-100 text-gray-400 hover:bg-glass-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
