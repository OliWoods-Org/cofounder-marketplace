'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FEATURED_AGENTS, AgentTemplate } from '@/data/featured-agents'

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Sarah Chen',
    rating: 5,
    date: '2024-01-15',
    content: 'This agent has saved our team countless hours. The automation is seamless and the results are consistently high quality.',
    helpful: 24
  },
  {
    id: '2',
    author: 'Marcus Johnson',
    rating: 4,
    date: '2024-01-10',
    content: 'Great agent overall. Setup was straightforward and it integrates well with our existing workflow. Would love to see more customization options.',
    helpful: 18
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    rating: 5,
    date: '2024-01-05',
    content: 'Exactly what we needed for our development pipeline. The MCP integrations work flawlessly.',
    helpful: 12
  }
]

// Mock changelog data
const MOCK_CHANGELOG = [
  {
    version: '2.1.0',
    date: '2024-01-20',
    changes: ['Added support for custom triggers', 'Improved performance by 40%', 'Fixed edge case in report generation']
  },
  {
    version: '2.0.0',
    date: '2024-01-01',
    changes: ['Major rewrite with new MCP integrations', 'New dashboard UI', 'Breaking: Updated configuration schema']
  },
  {
    version: '1.5.0',
    date: '2023-12-15',
    changes: ['Added Slack integration', 'Bug fixes and stability improvements']
  }
]

type TabType = 'overview' | 'reviews' | 'documentation' | 'changelog'

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

function MCPBadge({ name }: { name: string }) {
  const icons: Record<string, string> = {
    github: 'GH',
    linear: 'LN',
    slack: 'SL',
    playwright: 'PW',
    filesystem: 'FS',
    resend: 'RS'
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 glass-panel rounded-lg">
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent-primary/20 to-accent-hover/20 flex items-center justify-center text-accent-primary font-mono text-xs font-bold">
        {icons[name] || name.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-medium text-white capitalize">{name}</p>
        <p className="text-xs text-gray-500">MCP Server</p>
      </div>
    </div>
  )
}

function RelatedAgentCard({ agent }: { agent: AgentTemplate }) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="glass-panel p-4 transition-all duration-300 hover:bg-glass-200 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center text-white font-bold">
            {agent.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">{agent.name}</h4>
            <p className="text-xs text-gray-400">{agent.role}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-accent-primary">${agent.price}</p>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-400">{agent.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function AgentDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const agent = FEATURED_AGENTS.find(a => a.id === params.id)

  if (!agent) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Agent Not Found</h1>
          <Link href="/" className="text-accent-primary hover:text-accent-secondary transition-colors">
            Return to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const relatedAgents = FEATURED_AGENTS.filter(a =>
    a.id !== agent.id &&
    a.tags.some(tag => agent.tags.includes(tag))
  ).slice(0, 3)

  const features = [
    'Automated workflow execution',
    'Real-time monitoring and alerts',
    'Seamless MCP integration',
    'Customizable triggers and schedules',
    'Detailed activity logging',
    'Team collaboration support'
  ]

  const tabs: { key: TabType; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'documentation', label: 'Documentation' },
    { key: 'changelog', label: 'Changelog' }
  ]

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh-gradient">
      {/* Mesh gradient background overlay */}
      <div className="mesh-gradient" />

      {/* Navigation */}
      <nav className="border-b border-glass-200 bg-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-accent-primary transition-colors">Marketplace</Link>
            <span>/</span>
            <Link href="/" className="hover:text-accent-primary transition-colors">Agents</Link>
            <span>/</span>
            <span className="text-white">{agent.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="glass-panel p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Agent Icon */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center text-white font-bold text-4xl shadow-lg shadow-accent-primary/25 flex-shrink-0">
                  {agent.name.charAt(0)}
                </div>

                {/* Agent Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
                    <span className="px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium">
                      {agent.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <span>by</span>
                      <span className="text-white font-medium">{agent.builder}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <StarRating rating={Math.round(agent.rating)} size="sm" />
                      <span className="ml-1">{agent.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({MOCK_REVIEWS.length} reviews)</span>
                    </span>
                    <span>{agent.downloads.toLocaleString()} deploys</span>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Deploy CTA - Mobile */}
            <div className="lg:hidden glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400">Monthly subscription</p>
                  <p className="text-3xl font-bold blue-text">${agent.price}<span className="text-lg text-gray-400">/mo</span></p>
                </div>
              </div>
              <button className="btn-primary w-full py-4 text-lg">
                Deploy Now
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">Cancel anytime. No contracts.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-glass-200">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'text-accent-primary border-b-2 border-accent-primary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <>
                  {/* Features */}
                  <div className="glass-panel p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-accent-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configuration */}
                  <div className="glass-panel p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Focus Area</p>
                        <p className="text-white">{agent.config.focus}</p>
                      </div>
                      {agent.config.schedule && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Schedule</p>
                          <p className="text-white font-mono text-sm">{agent.config.schedule}</p>
                        </div>
                      )}
                      {agent.config.triggers && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Triggers</p>
                          <div className="flex flex-wrap gap-2">
                            {agent.config.triggers.map((trigger) => (
                              <span key={trigger} className="px-3 py-1 rounded-full bg-glass-200 text-gray-300 text-sm border border-glass-300">
                                {trigger.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MCP Requirements */}
                  <div className="glass-panel p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">MCP Requirements</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      This agent requires the following MCP servers to function. Make sure you have them configured.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {agent.config.mcp.map((mcp) => (
                        <MCPBadge key={mcp} name={mcp} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Reviews Summary */}
                  <div className="glass-panel p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-5xl font-bold text-white">{agent.rating.toFixed(1)}</p>
                        <StarRating rating={Math.round(agent.rating)} size="lg" />
                        <p className="text-sm text-gray-400 mt-1">{MOCK_REVIEWS.length} reviews</p>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = MOCK_REVIEWS.filter(r => r.rating === stars).length
                          const percentage = (count / MOCK_REVIEWS.length) * 100
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

                  {/* Individual Reviews */}
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="glass-panel p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{review.author}</span>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</p>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.content}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'documentation' && (
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Documentation</h2>
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-lg font-medium text-white mt-6 mb-3">Getting Started</h3>
                    <p className="text-gray-300 mb-4">
                      Follow these steps to deploy and configure {agent.name} for your workflow.
                    </p>

                    <h4 className="text-md font-medium text-white mt-4 mb-2">1. Prerequisites</h4>
                    <p className="text-gray-300 mb-2">Ensure you have the following MCP servers configured:</p>
                    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                      {agent.config.mcp.map((mcp) => (
                        <li key={mcp} className="capitalize">{mcp} MCP Server</li>
                      ))}
                    </ul>

                    <h4 className="text-md font-medium text-white mt-4 mb-2">2. Installation</h4>
                    <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm text-gray-300 mb-4">
                      <code>npx cofounder deploy {agent.id}</code>
                    </div>

                    <h4 className="text-md font-medium text-white mt-4 mb-2">3. Configuration</h4>
                    <p className="text-gray-300 mb-2">
                      After deployment, configure the agent through the dashboard or update your AGENTS.md file.
                    </p>
                    <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                      <pre>{`# ${agent.name}
role: "${agent.role}"
focus: "${agent.config.focus}"
mcp: [${agent.config.mcp.map(m => `"${m}"`).join(', ')}]${agent.config.schedule ? `\nschedule: "${agent.config.schedule}"` : ''}`}</pre>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'changelog' && (
                <div className="space-y-4">
                  {MOCK_CHANGELOG.map((release) => (
                    <div key={release.version} className="glass-panel p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary font-mono text-sm font-medium">
                          v{release.version}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(release.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {release.changes.map((change, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="text-accent-primary mt-1">-</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deploy Card - Desktop */}
            <div className="hidden lg:block glass-panel p-6 sticky top-24">
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Monthly subscription</p>
                <p className="text-4xl font-bold blue-text">${agent.price}<span className="text-xl text-gray-400">/mo</span></p>
              </div>
              <button className="btn-primary w-full py-4 text-lg mb-3">
                Deploy Now
              </button>
              <p className="text-center text-sm text-gray-500 mb-6">Cancel anytime. No contracts.</p>

              <div className="border-t border-glass-200 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex items-center gap-1">
                    <StarRating rating={Math.round(agent.rating)} size="sm" />
                    <span className="text-white">{agent.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Deploys</span>
                  <span className="text-white">{agent.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Builder</span>
                  <span className="text-white">{agent.builder}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">MCP Servers</span>
                  <span className="text-white">{agent.config.mcp.length}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-glass-200 text-gray-300 text-sm hover:bg-glass-300 cursor-pointer transition-colors border border-glass-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Agents */}
            {relatedAgents.length > 0 && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Related Agents</h3>
                <div className="space-y-3">
                  {relatedAgents.map((relatedAgent) => (
                    <RelatedAgentCard key={relatedAgent.id} agent={relatedAgent} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
