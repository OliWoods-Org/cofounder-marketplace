'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for the dashboard
const MOCK_STATS = {
  totalSales: 1247,
  revenue: 48750,
  activeAgents: 12,
  downloads: 8934,
}

const MOCK_AGENTS = [
  {
    id: '1',
    name: 'DevOps Automation Pro',
    description: 'Automated CI/CD pipeline management with intelligent error handling.',
    price: 49,
    status: 'published' as const,
    downloads: 2340,
    rating: 4.8,
    revenue: 12450,
  },
  {
    id: '2',
    name: 'Security Scanner Elite',
    description: 'Real-time vulnerability detection and threat assessment.',
    price: 79,
    status: 'published' as const,
    downloads: 1820,
    rating: 4.9,
    revenue: 18340,
  },
  {
    id: '3',
    name: 'Data Pipeline Manager',
    description: 'ETL automation with smart data validation and transformation.',
    price: 59,
    status: 'draft' as const,
    downloads: 0,
    rating: 0,
    revenue: 0,
  },
  {
    id: '4',
    name: 'Customer Support Agent',
    description: 'AI-powered customer service with sentiment analysis.',
    price: 39,
    status: 'published' as const,
    downloads: 4774,
    rating: 4.7,
    revenue: 17960,
  },
]

const MOCK_ACTIVITY = [
  { id: '1', type: 'sale', message: 'DevOps Automation Pro was purchased', time: '2 minutes ago', amount: 49 },
  { id: '2', type: 'review', message: 'New 5-star review on Security Scanner Elite', time: '15 minutes ago' },
  { id: '3', type: 'sale', message: 'Customer Support Agent was purchased', time: '1 hour ago', amount: 39 },
  { id: '4', type: 'download', message: 'DevOps Automation Pro was deployed', time: '2 hours ago' },
  { id: '5', type: 'sale', message: 'Security Scanner Elite was purchased', time: '3 hours ago', amount: 79 },
  { id: '6', type: 'milestone', message: 'You reached 1,000 total sales!', time: '1 day ago' },
]

function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="glass-panel p-6 glass-panel-hover transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trendUp ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function AgentRow({
  agent,
  onEdit,
  onDelete,
}: {
  agent: typeof MOCK_AGENTS[0]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="glass-panel p-4 flex items-center justify-between gap-4 glass-panel-hover transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-900 font-bold text-lg shrink-0">
          {agent.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white truncate">{agent.name}</h4>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                agent.status === 'published'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {agent.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{agent.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-8 shrink-0">
        <div className="text-center">
          <p className="text-xs text-gray-500">Price</p>
          <p className="font-semibold text-white">${agent.price}/mo</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Downloads</p>
          <p className="font-semibold text-white">{agent.downloads.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="font-semibold gold-text">${agent.revenue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Rating</p>
          <p className="font-semibold text-white flex items-center gap-1">
            {agent.rating > 0 ? (
              <>
                <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {agent.rating}
              </>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(agent.id)}
            className="p-2 rounded-lg bg-glass-100 text-gray-400 hover:text-white hover:bg-glass-200 transition-all"
            title="Edit agent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(agent.id)}
            className="p-2 rounded-lg bg-glass-100 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete agent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({ activity }: { activity: typeof MOCK_ACTIVITY[0] }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'sale':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'review':
        return (
          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )
      case 'download':
        return (
          <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        )
      case 'milestone':
        return (
          <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-glass-100 last:border-0">
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
      {activity.amount && (
        <span className="text-sm font-semibold gold-text">+${activity.amount}</span>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [agents, setAgents] = useState(MOCK_AGENTS)

  const handleEdit = (id: string) => {
    console.log('Editing agent:', id)
    // TODO: Navigate to edit page
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      setAgents(agents.filter(a => a.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <section>
        <h3 className="font-display text-xl font-semibold text-white mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales"
            value={MOCK_STATS.totalSales.toLocaleString()}
            trend="12.5%"
            trendUp={true}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
          <StatCard
            title="Revenue"
            value={`$${MOCK_STATS.revenue.toLocaleString()}`}
            trend="8.2%"
            trendUp={true}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Active Agents"
            value={MOCK_STATS.activeAgents.toString()}
            trend="2"
            trendUp={true}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Total Downloads"
            value={MOCK_STATS.downloads.toLocaleString()}
            trend="15.3%"
            trendUp={true}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Revenue Chart Placeholder */}
      <section>
        <h3 className="font-display text-xl font-semibold text-white mb-4">Revenue Overview</h3>
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue (Last 30 days)</p>
              <p className="font-display text-3xl font-bold gold-text">$12,847</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20">
                30D
              </button>
              <button className="px-3 py-1 text-sm rounded-lg text-gray-400 hover:bg-glass-100 transition-colors">
                90D
              </button>
              <button className="px-3 py-1 text-sm rounded-lg text-gray-400 hover:bg-glass-100 transition-colors">
                1Y
              </button>
            </div>
          </div>
          {/* Chart Placeholder */}
          <div className="h-64 rounded-xl bg-glass-100 flex items-center justify-center border border-glass-200">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500 text-sm">Revenue chart will be displayed here</p>
              <p className="text-gray-600 text-xs mt-1">Integrate with your analytics provider</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* My Agents Section */}
        <section className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold text-white">My Agents</h3>
            <Link
              href="/dashboard/create"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-dark-900 font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/25 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Agent
            </Link>
          </div>
          <div className="space-y-3">
            {agents.map((agent) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {agents.length === 0 && (
            <div className="glass-panel p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="text-lg font-semibold text-white mb-2">No agents yet</h4>
              <p className="text-gray-500 mb-4">Create your first agent to start earning.</p>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-dark-900 font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Agent
              </Link>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <h3 className="font-display text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="glass-panel p-4">
            {MOCK_ACTIVITY.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
