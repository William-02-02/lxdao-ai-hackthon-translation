'use client'

import { useEffect, useState } from 'react'
import { Review } from '@/src/types'
import { useMockAccount } from '@/src/hooks/useMockAccount'
import { MOCK_COMPLETED_REVIEWS } from '@/src/mocks/data/completedReviews'
import Link from 'next/link'
import { ArrowLeftIcon, CheckBadgeIcon, StarIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/src/utils/format'
import FormattedDate from '@/src/components/common/FormattedDate'

export default function CompletedReviewsList() {
  const { address } = useMockAccount()
  const [reviews, setReviews] = useState<Review[]>([])
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (address) {
      const userReviews = MOCK_COMPLETED_REVIEWS.filter(
        review => review.reviewer === address
      )
      setReviews(userReviews)
    }
  }, [address])

  useEffect(() => {
    const dates: {[key: string]: string} = {}
    reviews.forEach(review => {
      dates[review.id] = formatDate(review.completedAt)
    })
    setFormattedDates(dates)
  }, [reviews])

  if (!reviews.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No completed reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <div className="text-sm text-gray-500">
          Total Reviews: {reviews.length}
        </div>
      </div>

      {/* 审核列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-indigo-600 truncate">
                        {review.taskTitle}
                      </h3>
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <CheckBadgeIcon className="mr-1 h-4 w-4" />
                        Reviewed
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="sm:flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          Score Given: {review.score}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <span className="font-medium text-green-600">
                            Earned: ${review.earnedAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 italic">
                    "{review.comment}"
                  </p>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      Completed: <FormattedDate date={review.completedAt} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm sm:mt-0">
                    <Link
                      href={`/tasks/${review.taskId}`}
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