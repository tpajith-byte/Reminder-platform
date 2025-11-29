import Link from 'next/link'

export default function Home() {
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
