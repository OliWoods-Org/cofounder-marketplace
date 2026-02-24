'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'DevOps',
  'Security',
  'Data Engineering',
  'Customer Support',
  'Project Management',
  'Marketing',
  'Sales',
  'Finance',
  'HR',
  'Legal',
  'Other',
]

const PRICING_TIERS = [
  { value: 19, label: 'Starter', description: 'Basic automation' },
  { value: 39, label: 'Professional', description: 'Advanced features' },
  { value: 79, label: 'Enterprise', description: 'Full capabilities' },
  { value: 0, label: 'Custom', description: 'Set your own price' },
]

interface FormData {
  name: string
  description: string
  shortDescription: string
  category: string
  price: number
  customPrice: string
  tags: string[]
  capabilities: string[]
  requirements: string
  documentation: string
}

export default function CreateAgentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [tagInput, setTagInput] = useState('')
  const [capabilityInput, setCapabilityInput] = useState('')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    price: 39,
    customPrice: '',
    tags: [],
    capabilities: [],
    requirements: '',
    documentation: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceSelect = (price: number) => {
    setFormData((prev) => ({ ...prev, price }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleAddCapability = () => {
    if (capabilityInput.trim() && !formData.capabilities.includes(capabilityInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        capabilities: [...prev.capabilities, capabilityInput.trim()],
      }))
      setCapabilityInput('')
    }
  }

  const handleRemoveCapability = (capability: string) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.filter((c) => c !== capability),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Submitting agent:', formData)
    // TODO: Integrate with backend API

    setIsSubmitting(false)
    router.push('/dashboard')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.shortDescription.trim() && formData.category
      case 2:
        return formData.description.trim() && formData.capabilities.length > 0
      case 3:
        return formData.price > 0 || (formData.price === 0 && formData.customPrice)
      default:
        return true
    }
  }

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Pricing' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="font-display text-3xl font-bold text-white">Create New Agent</h1>
        <p className="text-gray-400 mt-2">
          Build and publish your AI agent to the marketplace. Earn 70% revenue share on every sale.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-accent-primary text-white'
                      : 'bg-glass-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`ml-3 font-medium ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-glass-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass-panel p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., DevOps Automation Pro"
                  className="w-full px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Description * <span className="text-gray-500">(max 100 characters)</span>
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  maxLength={100}
                  placeholder="Brief description for search results and cards"
                  className="w-full px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.shortDescription.length}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
                >
                  <option value="" className="bg-dark-800">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-dark-800">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                    className="flex-1 px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-3 rounded-xl bg-glass-200 text-gray-300 hover:bg-glass-300 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-accent-secondary"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe what your agent does, its key features, and use cases..."
                  className="w-full px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capabilities *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={capabilityInput}
                    onChange={(e) => setCapabilityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
                    placeholder="Add a capability (e.g., 'Automated CI/CD pipelines')"
                    className="flex-1 px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddCapability}
                    className="px-4 py-3 rounded-xl bg-glass-200 text-gray-300 hover:bg-glass-300 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.capabilities.map((capability, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-2 rounded-xl bg-glass-100 border border-glass-200"
                    >
                      <span className="text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {capability}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCapability(capability)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {formData.capabilities.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">Add at least one capability</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Requirements / Prerequisites
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="What does the buyer need to have set up before using this agent?"
                  className="w-full px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Documentation URL
                </label>
                <input
                  type="url"
                  name="documentation"
                  value={formData.documentation}
                  onChange={handleInputChange}
                  placeholder="https://docs.example.com/my-agent"
                  className="w-full px-4 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Select Pricing Tier
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PRICING_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => handlePriceSelect(tier.value)}
                      className={`p-6 rounded-xl border text-left transition-all ${
                        formData.price === tier.value
                          ? 'bg-accent-primary/10 border-accent-primary/50 ring-2 ring-accent-primary/20'
                          : 'bg-glass-100 border-glass-300 hover:border-glass-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-white">{tier.label}</span>
                        {tier.value > 0 ? (
                          <span className="font-display text-2xl font-bold blue-text">
                            ${tier.value}<span className="text-sm text-gray-400">/mo</span>
                          </span>
                        ) : (
                          <span className="text-gray-400">Custom</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{tier.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {formData.price === 0 && (
                <div className="animate-slide-up">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Price (USD/month)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="customPrice"
                      value={formData.customPrice}
                      onChange={handleInputChange}
                      min={1}
                      placeholder="99"
                      className="w-full pl-8 pr-16 py-3 rounded-xl bg-glass-100 border border-glass-300 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">/month</span>
                  </div>
                </div>
              )}

              {/* Revenue Preview */}
              <div className="glass-panel p-6 bg-green-500/5 border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Your Earnings</h4>
                    <p className="text-sm text-gray-400">70% revenue share</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Per Sale</p>
                    <p className="font-display text-xl font-bold text-green-400">
                      ${((formData.price || Number(formData.customPrice) || 0) * 0.7).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">10 Sales/mo</p>
                    <p className="font-display text-xl font-bold text-green-400">
                      ${((formData.price || Number(formData.customPrice) || 0) * 0.7 * 10).toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">100 Sales/mo</p>
                    <p className="font-display text-xl font-bold text-green-400">
                      ${((formData.price || Number(formData.customPrice) || 0) * 0.7 * 100).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-glass-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-accent-primary to-accent-hover text-white hover:shadow-lg hover:shadow-accent-primary/25'
                    : 'bg-glass-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isStepValid()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                  isSubmitting || !isStepValid()
                    ? 'bg-glass-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-accent-primary to-accent-hover text-white hover:shadow-lg hover:shadow-accent-primary/25'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Agent
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-8 glass-panel p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Tips for Success
        </h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Use clear, specific names that describe what your agent does
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Include detailed documentation to help buyers get started quickly
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Price competitively based on the value your agent provides
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Add relevant tags to improve discoverability in search
          </li>
        </ul>
      </div>
    </div>
  )
}
