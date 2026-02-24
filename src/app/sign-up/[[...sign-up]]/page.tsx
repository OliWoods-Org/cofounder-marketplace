import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism container */}
        <div className="bg-glass-100 backdrop-blur-xl border border-glass-300 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-dark-900 font-bold text-3xl">C</span>
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
                  'bg-gold-500 hover:bg-gold-400 text-dark-900 font-medium',
                card: 'bg-transparent shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'bg-glass-200 border-glass-300 text-white hover:bg-glass-300',
                formFieldInput:
                  'bg-glass-200 border-glass-300 text-white placeholder-gray-500',
                formFieldLabel: 'text-gray-300',
                identityPreviewText: 'text-white',
                identityPreviewEditButton: 'text-gold-400',
                footerActionLink: 'text-gold-400 hover:text-gold-300',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
