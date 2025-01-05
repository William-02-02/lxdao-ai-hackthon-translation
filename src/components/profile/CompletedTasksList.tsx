'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/src/types/task'
import { useMockAccount } from '@/src/hooks/useMockAccount'
import { MOCK_COMPLETED_TASKS } from '@/src/mocks/data/completedTasks'
import Link from 'next/link'
import { ArrowLeftIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/src/utils/format'
import FormattedDate from '@/src/components/common/FormattedDate'

export default function CompletedTasksList() {
  const { address } = useMockAccount()
  const [tasks, setTasks] = useState<Task[]>([])
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (address) {
      const userTasks = MOCK_COMPLETED_TASKS.filter(
        task => task.translatedBy === address
      )
      setTasks(userTasks)
    }
  }, [address])

  useEffect(() => {
    const dates: {[key: string]: string} = {}
    tasks.forEach(task => {
      dates[task.id] = formatDate(task.completedAt!)
    })
    setFormattedDates(dates)
  }, [tasks])

  if (!tasks.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No completed tasks yet.</p>
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
          Total Completed: {tasks.length}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-indigo-600 truncate">
                        {task.title}
                      </h3>
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <CheckCircleIcon className="mr-1 h-4 w-4" />
                        Completed
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="sm:flex">
                        <div className="flex items-center text-sm text-gray-500">
                          {task.sourceLang.toUpperCase()} → {task.targetLang.toUpperCase()}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            Review Score: {task.reviewScore}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="font-medium text-green-600">
                          Earned: ${task.earnedAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      Completed: <FormattedDate date={task.completedAt!} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm sm:mt-0">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details →
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