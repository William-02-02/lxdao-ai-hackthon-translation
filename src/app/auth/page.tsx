'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAuthUrl } from '@/src/services/oauth'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const returnTo = searchParams.get('returnTo') || '/tasks'
    // 获取授权 URL 并重定向
    const authUrl = getAuthUrl(returnTo)
    window.location.href = authUrl
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Redirecting to Coze...</h1>
      <p className="text-gray-600">Please wait while we redirect you to the authorization page.</p>
    </div>
  )
} 