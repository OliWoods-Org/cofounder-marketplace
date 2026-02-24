'use client'

import { useState } from 'react'
import { AgentCard } from '@/components/ui/AgentCard'
import { TeamCard } from '@/components/ui/TeamCard'
import { FEATURED_AGENTS, FEATURED_TEAMS } from '@/data/featured-agents'
import { GlassAuthButtons } from '@/components/auth/AuthButtons'

type Tab = 'agents' | 'teams'
type Category = 'all' | 'project-management' | 'devops' | 'security' | 'consulting'

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<Tab>('agents')
  const [category, setCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAgents = FEATURED_AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === 'all' || agent.tags.includes(category)
    return matchesSearch && matchesCategory
  })

  const handleDeploy = (id: string) => {
    console.log('Deploying:', id)
    // TODO: Integrate with Stripe checkout
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="border-b border-glass-200 bg-dark-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-dark-900 font-bold text-xl">🏪</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-white">CoFounder Marketplace</h1>
                <p className="text-xs text-gray-400">Buy, sell, and deploy AI agent teams</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                My Agents
              </button>
              <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                Builder Dashboard
              </button>
              <GlassAuthButtons />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent" />
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
              className="w-full px-6 py-4 rounded-2xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all"
            />
            <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

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
                    ? 'bg-gold-500 text-dark-900'
                    : 'bg-glass-100 text-gray-300 hover:bg-glass-200'
                }`}
              >
                Individual Agents
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'teams'
                    ? 'bg-accent-purple text-white'
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
                      ? 'bg-white/10 text-white border border-white/20'
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
                <AgentCard
                  key={agent.id}
                  {...agent}
                  onDeploy={handleDeploy}
                />
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
                className="mt-4 text-gold-400 hover:text-gold-300"
              >
                Clear filters
              </button>
            </div>
          )}
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
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-dark-900 font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all">
            Become a Builder
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 CoFounder Marketplace. Part of the Oliwood ecosystem.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
