'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAccessToken } from '@/src/services/oauth'
import Link from 'next/link'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        
        if (error) {
          throw new Error(searchParams.get('error_description') || error)
        }

        if (!code) {
          throw new Error('No authorization code received')
        }

        await getAccessToken(code)
        
        // 根据 state 参数决定重定向到哪里
        router.push(decodeURIComponent(state || '/tasks'))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authorization failed')
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-red-600 mb-4">
          Authorization failed: {error}
        </div>
        <Link
          href="/auth"
          className="text-indigo-600 hover:text-indigo-900"
        >
          Try Again
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-gray-600 mb-4">
        Authorizing...
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
} 