'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // 清除本地存储的 token
    localStorage.removeItem('coze_oauth_token')
    // 重定向到首页
    router.push('/')
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
      <p className="text-gray-600">Please wait while we log you out.</p>
    </div>
  )
} 