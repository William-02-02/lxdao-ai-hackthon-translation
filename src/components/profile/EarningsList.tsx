'use client'

import { useEffect, useState } from 'react'
import { Earning } from '@/src/types'
import { useMockAccount } from '@/src/hooks/useMockAccount'
import { MOCK_EARNINGS } from '@/src/mocks/data/earnings'
import Link from 'next/link'
import { ArrowLeftIcon, DocumentTextIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/src/utils/format'
import FormattedDate from '@/src/components/common/FormattedDate'

export default function EarningsList() {
  const { address } = useMockAccount()
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({})
  const [stats, setStats] = useState({
    totalEarned: 0,
    translationEarned: 0,
    reviewEarned: 0,
  })

  useEffect(() => {
    if (address) {
      const userEarnings = MOCK_EARNINGS.filter(
        earning => earning.address === address
      )
      setEarnings(userEarnings)

      const stats = userEarnings.reduce((acc, curr) => {
        acc.totalEarned += curr.amount
        if (curr.type === 'translation') {
          acc.translationEarned += curr.amount
        } else {
          acc.reviewEarned += curr.amount
        }
        return acc
      }, {
        totalEarned: 0,
        translationEarned: 0,
        reviewEarned: 0,
      })
      setStats(stats)
    }
  }, [address])

  useEffect(() => {
    const dates: {[key: string]: string} = {}
    earnings.forEach(earning => {
      dates[earning.id] = formatDate(earning.createdAt)
    })
    setFormattedDates(dates)
  }, [earnings])

  if (!earnings.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No earnings history yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮和统计 */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <div className="text-sm text-gray-500">
          Total Earned: ${stats.totalEarned}
        </div>
      </div>

      {/* 收益统计卡片 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">
                  Translation Earnings
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  ${stats.translationEarned}
                </dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentMagnifyingGlassIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">
                  Review Earnings
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  ${stats.reviewEarned}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 收益列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {earnings.map((earning) => (
            <li key={earning.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-indigo-600 truncate">
                        {earning.taskTitle}
                      </h3>
                      <span className={`
                        flex-shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
                        ${earning.type === 'translation' 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'bg-purple-100 text-purple-800'}
                      `}>
                        {earning.type === 'translation' ? (
                          <DocumentTextIcon className="mr-1 h-4 w-4" />
                        ) : (
                          <DocumentMagnifyingGlassIcon className="mr-1 h-4 w-4" />
                        )}
                        {earning.type.charAt(0).toUpperCase() + earning.type.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2">
                      {earning.type === 'translation' ? (
                        <p className="text-sm text-gray-500">
                          {earning.details.wordCount} words at ${earning.details.ratePerWord}/word
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {earning.details.reviewedParagraphs} paragraphs at ${earning.details.ratePerParagraph}/paragraph
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="font-medium text-green-600 text-lg">
                      ${earning.amount}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      Earned on: <FormattedDate date={earning.createdAt} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm sm:mt-0">
                    <Link
                      href={`/tasks/${earning.taskId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Task Details →
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 