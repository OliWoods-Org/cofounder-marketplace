'use client'

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

interface AuthButtonsProps {
  className?: string
}

export function AuthButtons({ className = '' }: AuthButtonsProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm text-gray-300 hover:text-accent-primary transition-colors">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 rounded-lg bg-accent-primary text-white font-medium text-sm hover:bg-accent-hover transition-colors shadow-neon-glow">
            Get Started
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                'w-10 h-10 rounded-xl border-2 border-accent-primary/50 hover:border-accent-primary transition-colors',
              userButtonPopoverCard:
                'bg-dark-800 border border-glass-300 shadow-2xl',
              userButtonPopoverActionButton:
                'text-gray-300 hover:text-white hover:bg-glass-200',
              userButtonPopoverActionButtonText: 'text-gray-300',
              userButtonPopoverActionButtonIcon: 'text-gray-400',
              userButtonPopoverFooter: 'hidden',
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  )
}

// Glassmorphism styled auth button variant
export function GlassAuthButtons({ className = '' }: AuthButtonsProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors backdrop-blur-sm bg-glass-100/50 rounded-lg border border-glass-200 hover:border-glass-300">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="btn-primary text-sm">
            Get Started
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-glass-100/50 backdrop-blur-sm border border-glass-200">
            <span className="text-xs text-gray-400">Signed in</span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  'w-10 h-10 rounded-xl border-2 border-accent-primary/50 hover:border-accent-primary transition-colors shadow-lg shadow-accent-primary/20',
                userButtonPopoverCard:
                  'bg-dark-800/95 backdrop-blur-xl border border-glass-300 shadow-2xl rounded-xl',
                userButtonPopoverActionButton:
                  'text-gray-300 hover:text-white hover:bg-glass-200 rounded-lg',
                userButtonPopoverActionButtonText: 'text-gray-300',
                userButtonPopoverActionButtonIcon: 'text-gray-400',
                userButtonPopoverFooter: 'hidden',
              },
            }}
            afterSignOutUrl="/"
          />
        </div>
      </SignedIn>
    </div>
  )
}
