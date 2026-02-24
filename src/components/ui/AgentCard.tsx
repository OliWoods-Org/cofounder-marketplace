'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AgentCardProps {
  id: string
  name: string
  role: string
  description: string
  price: number
  rating: number
  downloads: number
  builder: string
  tags: string[]
  onDeploy?: (id: string) => void
}

export function AgentCard({
  id,
  name,
  role,
  description,
  price,
  rating,
  downloads,
  builder,
  tags,
  onDeploy
}: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/agents/${id}`)
  }

  return (
    <div
      className={`glass-panel p-6 transition-all duration-300 cursor-pointer ${
        isHovered ? 'glass-panel-hover blue-glow scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center text-white font-bold text-lg shadow-neon-glow">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{name}</h3>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="blue-text font-display text-xl font-semibold">
            ${price}<span className="text-sm text-gray-400">/mo</span>
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded-full bg-glass-200 text-gray-300 border border-glass-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            {/* Gold stars for ratings - premium element */}
            <svg className="w-4 h-4 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating.toFixed(1)}
          </span>
          <span>{downloads.toLocaleString()} deploys</span>
        </div>
        <span>by {builder}</span>
      </div>

      {/* Action Button - Blue gradient */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDeploy?.(id)
        }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-hover text-white font-semibold transition-all hover:shadow-lg hover:shadow-accent-primary/25"
      >
        Deploy Agent
      </button>
    </div>
  )
}
