'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

interface ReviewFormProps {
  agentId: string
  onSubmit: () => void
}

export function ReviewForm({ agentId, onSubmit }: ReviewFormProps) {
  const { isSignedIn } = useUser()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isSignedIn) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-gray-400 mb-4">Sign in to leave a review</p>
        <a href="/sign-in" className="btn-primary px-6 py-2">
          Sign In
        </a>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          rating,
          comment: comment.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit review')
        return
      }

      setSuccess(true)
      setRating(0)
      setComment('')
      onSubmit()
    } catch {
      setError('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="glass-panel p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Review Submitted!</h3>
        <p className="text-gray-400">Thank you for your feedback.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Your Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-accent-gold'
                    : 'text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-gray-400 text-sm">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">
          Your Review <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this agent..."
          rows={4}
          maxLength={2000}
          className="w-full px-4 py-3 bg-glass-100 border border-glass-200 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {comment.length}/2000
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
