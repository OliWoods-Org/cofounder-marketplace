'use client'

import { useState, useEffect } from 'react'
import { ReviewForm } from './ReviewForm'

interface Review {
  id: string
  buyerId: string
  rating: number
  comment: string | null
  createdAt: string
}

interface ReviewStats {
  totalCount: number
  avgRating: number
  breakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ReviewsListProps {
  agentId: string
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses[size]} ${star <= rating ? 'text-accent-gold' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function ReviewsList({ agentId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/reviews`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load reviews')
        return
      }

      setReviews(data.reviews)
      setStats(data.stats)
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [agentId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="glass-panel p-6 animate-pulse">
          <div className="h-20 bg-glass-200 rounded"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel p-6 animate-pulse">
            <div className="h-4 bg-glass-200 rounded w-1/4 mb-2"></div>
            <div className="h-16 bg-glass-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-4 text-accent-primary hover:text-accent-secondary"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Reviews Summary */}
      {stats && (
        <div className="glass-panel p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold text-white">
                {stats.avgRating.toFixed(1)}
              </p>
              <StarRating rating={Math.round(stats.avgRating)} size="lg" />
              <p className="text-sm text-gray-400 mt-1">
                {stats.totalCount} review{stats.totalCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.breakdown[stars as keyof typeof stats.breakdown]
                const percentage = stats.totalCount > 0
                  ? (count / stats.totalCount) * 100
                  : 0
                return (
                  <div key={stars} className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400 w-3">{stars}</span>
                    <svg className="w-4 h-4 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 h-2 bg-glass-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-gold rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Form */}
      <ReviewForm agentId={agentId} onSubmit={fetchReviews} />

      {/* Individual Reviews */}
      {reviews.length === 0 ? (
        <div className="glass-panel p-6 text-center">
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="glass-panel p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    User {review.buyerId.slice(0, 8)}...
                  </span>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            {review.comment && (
              <p className="text-gray-300">{review.comment}</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
