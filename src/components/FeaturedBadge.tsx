'use client'

interface FeaturedBadgeProps {
  type: 'hero' | 'trending' | 'staff_pick' | 'new'
  size?: 'sm' | 'md'
}

const BADGE_CONFIG = {
  hero: {
    label: 'Featured',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    className: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
  },
  trending: {
    label: 'Trending',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  staff_pick: {
    label: 'Staff Pick',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  new: {
    label: 'New',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
      </svg>
    ),
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
}

export function FeaturedBadge({ type, size = 'md' }: FeaturedBadgeProps) {
  const config = BADGE_CONFIG[type]
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses} ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  )
}

export function FeaturedHeroBanner({
  agent
}: {
  agent: {
    name: string
    description: string | null
    role: string | null
    price: string
    id: string
  }
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-primary/20 via-accent-hover/10 to-transparent border border-accent-primary/30 p-8 mb-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-hover/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Agent Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-accent-primary/25 flex-shrink-0">
          {agent.name.charAt(0)}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FeaturedBadge type="hero" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{agent.name}</h2>
          {agent.role && (
            <p className="text-gray-400 mb-2">{agent.role}</p>
          )}
          {agent.description && (
            <p className="text-gray-300 line-clamp-2">{agent.description}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-3xl font-bold blue-text">${agent.price}<span className="text-lg text-gray-400">/mo</span></p>
          <a
            href={`/agents/${agent.id}`}
            className="btn-primary px-6 py-2"
          >
            View Agent
          </a>
        </div>
      </div>
    </div>
  )
}
