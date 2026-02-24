'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AgentCard } from '@/components/ui/AgentCard'
import { TeamCard } from '@/components/ui/TeamCard'
import { FEATURED_AGENTS, FEATURED_TEAMS } from '@/data/featured-agents'
import { GlassAuthButtons } from '@/components/auth/AuthButtons'
import { FeaturedBadge, FeaturedHeroBanner } from '@/components/FeaturedBadge'

type Tab = 'agents' | 'teams'
type Category = 'all' | 'project-management' | 'devops' | 'security' | 'consulting'

interface FeaturedAgent {
  id: string
  agentId: string
  placementType: string
  agent: {
    id: string
    name: string
    description: string | null
    role: string | null
    price: string
    rating: string | null
    downloads: number
  }
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<Tab>('agents')
  const [category, setCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredAgents, setFeaturedAgents] = useState<FeaturedAgent[]>([])
  const [heroAgent, setHeroAgent] = useState<FeaturedAgent | null>(null)

  // Fetch featured agents from API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/featured')
        if (response.ok) {
          const data = await response.json()
          setFeaturedAgents(data.featured || [])
          // Find hero featured agent
          const hero = data.featured?.find((f: FeaturedAgent) => f.placementType === 'hero')
          if (hero) setHeroAgent(hero)
        }
      } catch (error) {
        console.error('Failed to fetch featured agents:', error)
      }
    }
    fetchFeatured()
  }, [])

  const filteredAgents = FEATURED_AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === 'all' || agent.tags.includes(category)
    return matchesSearch && matchesCategory
  })

  // Get trending agents from API or fallback to top-rated static ones
  const trendingAgentIds = featuredAgents
    .filter(f => f.placementType === 'trending')
    .map(f => f.agentId)

  const handleDeploy = (id: string) => {
    console.log('Deploying:', id)
    // TODO: Integrate with Stripe checkout
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh-gradient">
      {/* Mesh gradient background overlay */}
      <div className="mesh-gradient" />

      {/* Header */}
      <header className="border-b border-glass-200 bg-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center overflow-hidden">
                <img src="/cofounder.svg" alt="CoFounder" className="w-8 h-8" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-white">CoFounder Marketplace</h1>
                <p className="text-xs text-gray-400">Buy, sell, and deploy AI agent teams</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/leaderboard" className="px-4 py-2 text-sm text-gray-300 hover:text-accent-primary transition-colors">
                Leaderboard
              </Link>
              <button className="px-4 py-2 text-sm text-gray-300 hover:text-accent-primary transition-colors">
                My Agents
              </button>
              <button className="px-4 py-2 text-sm text-gray-300 hover:text-accent-primary transition-colors">
                Builder Dashboard
              </button>
              <GlassAuthButtons />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            The App Store for <span className="gold-text">AI Agents</span>
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Deploy pre-built agents and teams with one click. Automate your workflow in minutes, not months.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search agents, teams, or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
            />
            <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Hero Banner */}
      {heroAgent && (
        <section className="px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <FeaturedHeroBanner agent={heroAgent.agent} />
          </div>
        </section>
      )}

      {/* Trending Section */}
      {featuredAgents.filter(f => f.placementType === 'trending').length > 0 && (
        <section className="px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <FeaturedBadge type="trending" />
              <h3 className="text-lg font-semibold text-white">Trending Now</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {featuredAgents
                .filter(f => f.placementType === 'trending')
                .slice(0, 5)
                .map((featured) => (
                  <Link
                    key={featured.id}
                    href={`/agents/${featured.agent.id}`}
                    className="flex-shrink-0 w-64 glass-panel p-4 hover:bg-glass-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center text-white font-bold text-lg">
                        {featured.agent.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{featured.agent.name}</p>
                        <p className="text-sm text-gray-400">{featured.agent.role}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Tabs & Filters */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'agents'
                    ? 'bg-accent-primary text-white shadow-neon-glow'
                    : 'bg-glass-100 text-gray-300 hover:bg-glass-200'
                }`}
              >
                Individual Agents
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'teams'
                    ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/25'
                    : 'bg-glass-100 text-gray-300 hover:bg-glass-200'
                }`}
              >
                Agent Teams
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'project-management', 'devops', 'security', 'consulting'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    category === cat
                      ? 'bg-accent-primary/20 text-accent-secondary border border-accent-primary/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {activeTab === 'agents' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="relative">
                  {/* Show badge if agent is trending */}
                  {trendingAgentIds.includes(agent.id) && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <FeaturedBadge type="trending" size="sm" />
                    </div>
                  )}
                  <AgentCard
                    {...agent}
                    onDeploy={handleDeploy}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {FEATURED_TEAMS.map((team) => (
                <TeamCard
                  key={team.id}
                  {...team}
                  onDeploy={handleDeploy}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {activeTab === 'agents' && filteredAgents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No agents found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setCategory('all') }}
                className="mt-4 text-accent-primary hover:text-accent-secondary transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Top Builders</h3>
              <Link href="/leaderboard" className="text-accent-primary hover:text-accent-secondary text-sm transition-colors">
                View Leaderboard →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto">
              {['OliwoodLabs', 'GoodCompanies', 'AgentForge'].map((builder, idx) => (
                <div key={builder} className="flex items-center gap-3 px-4 py-3 bg-glass-100 rounded-xl flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    'bg-gradient-to-br from-amber-600 to-amber-800'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-white font-medium">{builder}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Build and sell your own agents
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Earn 70% revenue share on every sale. Join our builder community and monetize your AI automation expertise.
          </p>
          <button className="btn-primary px-8 py-3">
            Become a Builder
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            2026 CoFounder Marketplace. Part of the Oliwood ecosystem.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/leaderboard" className="hover:text-accent-primary transition-colors">Leaderboard</Link>
            <a href="#" className="hover:text-accent-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-accent-primary transition-colors">API</a>
            <a href="#" className="hover:text-accent-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
