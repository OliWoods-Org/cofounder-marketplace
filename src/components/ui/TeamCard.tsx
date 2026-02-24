'use client'

import { useState } from 'react'

interface TeamMember {
  name: string
  role: string
}

interface TeamCardProps {
  id: string
  name: string
  description: string
  agents: TeamMember[]
  price: number
  rating: number
  downloads: number
  builder: string
  onDeploy?: (id: string) => void
}

export function TeamCard({
  id,
  name,
  description,
  agents,
  price,
  rating,
  downloads,
  builder,
  onDeploy
}: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`glass-panel p-6 transition-all duration-300 cursor-pointer ${
        isHovered ? 'glass-panel-hover blue-glow scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
              Team
            </span>
            <span className="text-gray-400 text-sm">{agents.length} agents</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-white">{name}</h3>
        </div>
        <div className="text-right">
          <p className="blue-text font-display text-2xl font-semibold">
            ${price}
          </p>
          <p className="text-xs text-gray-400">per month</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4">
        {description}
      </p>

      {/* Agent Avatars */}
      <div className="flex items-center mb-4">
        <div className="flex -space-x-2">
          {agents.slice(0, 5).map((agent, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-hover/30 border-2 border-dark-800 flex items-center justify-center text-xs font-medium text-gray-300"
              title={`${agent.name} - ${agent.role}`}
            >
              {agent.name.charAt(0)}
            </div>
          ))}
          {agents.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-glass-300 border-2 border-dark-800 flex items-center justify-center text-xs font-medium text-gray-400">
              +{agents.length - 5}
            </div>
          )}
        </div>
        <div className="ml-3 text-sm text-gray-400">
          {agents.map(a => a.role).slice(0, 3).join(', ')}
          {agents.length > 3 && '...'}
        </div>
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

      {/* Action Button - Blue gradient for teams */}
      <button
        onClick={() => onDeploy?.(id)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-primary text-white font-semibold transition-all hover:shadow-lg hover:shadow-accent-purple/25"
      >
        Deploy Team
      </button>
    </div>
  )
}
