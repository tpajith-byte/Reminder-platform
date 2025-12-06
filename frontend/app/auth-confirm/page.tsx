'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function AuthConfirmPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                // Get parameters from the URL hash
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const token_hash = hashParams.get('token_hash')
                const type = hashParams.get('type')
                const access_token = hashParams.get('access_token')
                const refresh_token = hashParams.get('refresh_token')
                const error = hashParams.get('error')
                const error_description = hashParams.get('error_description')

                if (error) {
                    setStatus('error')
                    setErrorMessage(error_description || 'Failed to confirm email')
                    return
                }

                // Handle token_hash format (default Supabase email confirmation)
                if (token_hash && type === 'signup') {
                    const { error: verifyError } = await supabase.auth.verifyOtp({
                        token_hash,
                        type: 'signup'
                    })

                    if (verifyError) {
                        setStatus('error')
                        setErrorMessage(verifyError.message)
                        return
                    }

                    setStatus('success')
                    return
                }

                // Handle access_token/refresh_token format (custom redirect)
                if (access_token && refresh_token) {
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token,
                        refresh_token
                    })

                    if (sessionError) {
                        setStatus('error')
                        setErrorMessage(sessionError.message)
                        return
                    }

                    setStatus('success')
                    return
                }

                // No valid tokens found
                setStatus('error')
                setErrorMessage('Invalid confirmation link')
            } catch (err: any) {
                setStatus('error')
                setErrorMessage(err.message || 'Failed to confirm email')
            }
        }

        confirmEmail()
    }, [supabase])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-center">
                    <div className="mx-auto w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <h1 className="text-2xl font-bold text-white">Confirming your email...</h1>
                    <p className="text-gray-300">Please wait a moment</p>
                </div>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Confirmation Failed</h1>
                        <p className="text-gray-300 mb-6">{errorMessage}</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 text-center">
                            The confirmation link may have expired or already been used.
                        </p>
                        <Link
                            href="/signup"
                            className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition text-center shadow-lg"
                        >
                            Try Signing Up Again
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Success state
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
