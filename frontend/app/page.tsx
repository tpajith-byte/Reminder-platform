'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function Home() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [readyToConfirm, setReadyToConfirm] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    // Check for confirmation tokens in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const token_hash = hashParams.get('token_hash')
    const type = hashParams.get('type')
    const error = hashParams.get('error')
    const error_description = hashParams.get('error_description')

    if (error) {
      // If the error is about invalid/expired token, it's likely the email scanner consumed it
      // or the user is already verified.
      if (error_description?.includes('expired') || error_description?.includes('already been used')) {
        setConfirmError('This link has expired or was already used. You may have already verified your email.')
      } else {
        setConfirmError(error_description || 'Email confirmation failed')
      }
      return
    }

    // If we have a token_hash, show the confirmation button
    if (token_hash && type === 'signup') {
      setReadyToConfirm(true)
    }
    // If we have an access_token (implicit flow), we are already confirmed/logged in
    else if (hashParams.has('access_token')) {
      setShowConfirmation(true)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleConfirmClick = async () => {
    setIsConfirming(true)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const token_hash = hashParams.get('token_hash')
    const type = hashParams.get('type') as any

    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token_hash!,
        type: type || 'signup',
      })

      if (error) throw error

      setShowConfirmation(true)
      setReadyToConfirm(false)
      window.history.replaceState(null, '', window.location.pathname)
    } catch (err: any) {
      setConfirmError(err.message || 'Failed to verify email')
    } finally {
      setIsConfirming(false)
    }
  }

  // Show email confirmation success message
  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Email Confirmed!</h1>
            <p className="text-gray-300 mb-6">Thank you for confirming your email address.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-gray-200 text-center">
                Your account is now active. You can sign in to start using the Reminder Platform.
              </p>
            </div>

            <Link
              href="/login"
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition text-center shadow-lg"
            >
              Proceed to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show confirmation error if any
  if (confirmError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">⚠️ LINK EXPIRED ⚠️</h1>
            <p className="text-xs text-gray-500 font-mono mb-2">v2.0 - Magic Link Update</p>
            <p className="text-gray-300 mb-6">{confirmError}</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition text-center shadow-lg"
            >
              Go to Login & Request Magic Link
            </Link>
            <Link
              href="/signup"
              className="block w-full py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition text-center border border-white/20"
            >
              Try Signing Up Again
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show manual confirmation button if ready
  if (readyToConfirm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Confirm Your Email</h1>
            <p className="text-gray-300 mb-6">Click the button below to complete your account verification.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleConfirmClick}
              disabled={isConfirming}
              className="block w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition text-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConfirming ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify Email Now'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Normal home page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Reminder Platform
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Never miss an important moment. Stay organized with location-based reminders and intelligent notifications.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/signup"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg hover:bg-white/20 transition border border-white/20"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
