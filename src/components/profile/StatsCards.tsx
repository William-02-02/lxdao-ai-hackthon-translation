'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useMockAccount } from '@/src/hooks/useMockAccount'
import { User } from '@/src/types'
import { mockApi } from '@/src/mocks'
import { DocumentTextIcon, DocumentCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function StatsCards() {
  const { address: realAddress } = useAccount()
  const { address, isConnected } = useMockAccount()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (address) {
      mockApi.getUser(address).then(userData => {
        if (userData) {
          setUser(userData)
        } else {
          setUser({
            address,
            role: 'translator',
            reputation: 100,
            completedTasks: 0,
            completedReviews: 0,
            totalEarned: 0
          })
        }
      })
    }
  }, [address])

  if (!isConnected || !user) return null

  const stats = [
    {
      name: 'Completed Tasks',
      value: user.completedTasks || 0,
      icon: DocumentTextIcon,
      mainHref: '/profile/completed-tasks',
      actionHref: '/tasks',
      cta: user.completedTasks === 0 ? 'Browse Tasks' : 'View All Tasks',
      description: user.completedTasks === 0 
        ? 'Start your translation journey by accepting tasks'
        : `Click to view your completed tasks history`
    },
    {
      name: 'Completed Reviews',
      value: user.completedReviews || 0,
      icon: DocumentCheckIcon,
      mainHref: user.completedTasks >= 5 ? '/profile/completed-reviews' : '#',
      actionHref: user.completedTasks >= 5 ? '/review' : '#',
      cta: user.completedReviews === 0 
        ? user.completedTasks >= 5 
          ? 'Start Reviewing'
          : 'Complete 5 tasks to unlock'
        : 'View All Reviews',
      description: user.completedReviews === 0
        ? user.completedTasks >= 5
          ? 'You can now start reviewing translations'
          : `Complete ${5 - user.completedTasks} more tasks to unlock reviewer role`
        : `Click to view your review history`
    },
    {
      name: 'Total Earned',
      value: `$${user.totalEarned.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      mainHref: '/profile/earnings',
      actionHref: user.totalEarned > 0 ? '/profile/earnings' : '/tasks',
      cta: user.totalEarned === 0 ? 'Start Earning' : 'View Details',
      description: user.totalEarned === 0
        ? 'Complete tasks and reviews to earn rewards'
        : `Click to view your earnings details`
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow ${
            stat.mainHref === '#' ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {stat.mainHref === '#' ? (
            <div className="p-5">
              <StatContent stat={stat} />
            </div>
          ) : (
            <Link href={stat.mainHref} className="block">
              <div className="p-5">
                <StatContent stat={stat} />
                {stat.actionHref !== '#' && (
                  <div className="mt-4 text-right">
                    <Link 
                      href={stat.actionHref}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {stat.cta} →
                    </Link>
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

function StatContent({ stat }: { stat: any }) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">
            {stat.name}
          </dt>
          <dd className="mt-1">
            <div className="text-2xl font-semibold text-gray-900">
              {stat.value}
            </div>
            <div className="mt-2">
              <div className="text-sm text-gray-500">
                {stat.description}
              </div>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  )
} 