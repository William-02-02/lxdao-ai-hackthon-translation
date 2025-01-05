'use client'

import { useEffect, useState } from 'react'
import { mockApi } from '@/src/mocks'
import { PlatformStats } from '@/src/types'

export default function StatsSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const data = await mockApi.getPlatformStats()
      setStats(data)
    }
    fetchStats()
  }, [])

  if (!stats) return null

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-gray-600">Total Tasks</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
              {stats.platform.totalTasks}
            </dd>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-gray-600">Active Tasks</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
              {stats.platform.activeTasks}
            </dd>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-gray-600">Total Users</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
              {stats.platform.totalUsers}
            </dd>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-gray-600">Total Bounty</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
              ${stats.platform.totalBounty.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
} 