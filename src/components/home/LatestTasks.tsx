'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Task } from '@/src/types'
import { MOCK_TASKS } from '@/src/mocks/data/tasks'
import { formatDate } from '@/src/utils/format'
import FormattedDate from '@/src/components/common/FormattedDate'

export default function LatestTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({})

  useEffect(() => {
    // 在实际应用中，这里会从API获取数据
    setTasks(Object.values(MOCK_TASKS).slice(0, 3))
  }, [])

  useEffect(() => {
    // 格式化日期
    const dates: {[key: string]: string} = {}
    tasks.forEach(task => {
      dates[task.id] = formatDate(task.createdAt)
    })
    setFormattedDates(dates)
  }, [tasks])

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id}>
            <Link href={`/tasks/${task.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {task.title}
                    </p>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="truncate">
                          {task.sourceLang.toUpperCase()} → {task.targetLang.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <span className={`
                      px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${getStatusColor(task.status)}
                    `}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Bounty: {task.bounty} USDT
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created at <FormattedDate date={task.createdAt} />
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function getStatusColor(status: Task['status']) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'translating':
      return 'bg-blue-100 text-blue-800'
    case 'reviewing':
      return 'bg-purple-100 text-purple-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
} 