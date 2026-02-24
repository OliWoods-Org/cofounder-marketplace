import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-dark-900 bg-mesh-gradient flex items-center justify-center px-4">
      <div className="mesh-gradient" />
      <div className="w-full max-w-md relative z-10">
        {/* Glassmorphism container */}
        <div className="glass-panel p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center mx-auto mb-4 shadow-neon-glow">
              <span className="text-white font-bold text-3xl">C</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Join CoFounder
            </h1>
            <p className="text-gray-400">
              Create an account to start deploying AI agents
            </p>
          </div>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  'bg-accent-primary hover:bg-accent-hover text-white font-medium',
                card: 'bg-transparent shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'bg-glass-200 border-glass-300 text-white hover:bg-glass-300',
                formFieldInput:
                  'bg-glass-200 border-glass-300 text-white placeholder-gray-500',
                formFieldLabel: 'text-gray-300',
                identityPreviewText: 'text-white',
                identityPreviewEditButton: 'text-accent-primary',
                footerActionLink: 'text-accent-primary hover:text-accent-secondary',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
