'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      {error && (
        <p className="text-lg text-gray-800 mb-2">Error: {error}</p>
      )}
      {errorDescription && (
        <p className="text-gray-600 mb-6">{errorDescription}</p>
      )}
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Return to Home
      </Link>
    </div>
  )
} 