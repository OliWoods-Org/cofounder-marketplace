'use client';

import { useState, useEffect, useCallback } from 'react';

interface ConnectStripeButtonProps {
  stripeAccountId?: string | null;
  onAccountCreated?: (accountId: string) => void;
  className?: string;
}

interface ConnectStatus {
  isConnected: boolean;
  isOnboarded: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  isLoading: boolean;
}

export function ConnectStripeButton({
  stripeAccountId,
  onAccountCreated,
  className = '',
}: ConnectStripeButtonProps) {
  const [status, setStatus] = useState<ConnectStatus>({
    isConnected: !!stripeAccountId,
    isOnboarded: false,
    chargesEnabled: false,
    payoutsEnabled: false,
    isLoading: true,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check account status on mount if account exists
  const checkAccountStatus = useCallback(async () => {
    if (!stripeAccountId) {
      setStatus((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await fetch(
        `/api/stripe/connect?accountId=${stripeAccountId}`
      );
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching account status:', data.error);
        setStatus((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      setStatus({
        isConnected: true,
        isOnboarded: data.data.status.isOnboarded,
        chargesEnabled: data.data.status.chargesEnabled,
        payoutsEnabled: data.data.status.payoutsEnabled,
        isLoading: false,
      });
    } catch (err) {
      console.error('Error checking account status:', err);
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }
  }, [stripeAccountId]);

  useEffect(() => {
    checkAccountStatus();
  }, [checkAccountStatus]);

  const handleConnect = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripeAccountId: stripeAccountId || undefined,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setIsProcessing(false);
        return;
      }

      // Save account ID if new account was created
      if (data.data.accountId && !stripeAccountId) {
        onAccountCreated?.(data.data.accountId);
      }

      // Redirect to onboarding or dashboard
      if (data.data.onboardingUrl) {
        window.location.href = data.data.onboardingUrl;
      } else if (data.data.dashboardUrl) {
        window.open(data.data.dashboardUrl, '_blank');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Error connecting Stripe:', err);
      setError('Failed to connect to Stripe. Please try again.');
      setIsProcessing(false);
    }
  };

  const renderStatusBadge = () => {
    if (status.isLoading) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-white/5 text-gray-400">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
          Checking...
        </span>
      );
    }

    if (status.chargesEnabled && status.payoutsEnabled) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Active
        </span>
      );
    }

    if (status.isOnboarded) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          Pending Verification
        </span>
      );
    }

    if (status.isConnected) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-orange-500/10 text-orange-400">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          Setup Incomplete
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-white/5 text-gray-400">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        Not Connected
      </span>
    );
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (status.chargesEnabled && status.payoutsEnabled)
      return 'Open Stripe Dashboard';
    if (status.isConnected) return 'Complete Setup';
    return 'Connect Stripe';
  };

  const getButtonIcon = () => {
    if (isProcessing) {
      return (
        <svg
          className="w-5 h-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    // Stripe icon
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
      </svg>
    );
  };

  return (
    <div
      className={`glass-panel p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#635BFF] to-[#A259FF] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">Stripe Connect</h3>
            <p className="text-sm text-gray-400">Receive payouts for your sales</p>
          </div>
        </div>
        {renderStatusBadge()}
      </div>

      {/* Info */}
      <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-[#D4AF37]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              <span className="font-semibold gold-text">70% revenue share</span> on all
              marketplace sales. Get paid directly to your bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleConnect}
        disabled={isProcessing || status.isLoading}
        className={`
          w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-200
          flex items-center justify-center gap-2
          ${
            status.chargesEnabled && status.payoutsEnabled
              ? 'bg-gradient-to-r from-[#635BFF] to-[#A259FF] text-white hover:shadow-lg hover:shadow-[#635BFF]/25'
              : 'bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0a0a0f] hover:shadow-lg hover:shadow-[#D4AF37]/25'
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        `}
      >
        {getButtonIcon()}
        {getButtonText()}
      </button>

      {/* Additional info for connected accounts */}
      {status.chargesEnabled && status.payoutsEnabled && (
        <p className="mt-3 text-center text-xs text-gray-500">
          Opens Stripe Express Dashboard in a new tab
        </p>
      )}
    </div>
  );
}

export default ConnectStripeButton;
