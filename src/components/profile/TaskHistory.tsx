'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { Task } from '@/src/types'
import { MOCK_TASKS } from '@/src/mocks/data/tasks'

export default function TaskHistory() {
  const { address } = useAccount()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (address) {
      // 模拟获取用户相关的任务
      const userTasks = Object.values(MOCK_TASKS).filter(
        task => task.createdBy === address || task.paragraphs.some(p => p.reviewers.includes(address))
      )
      setTasks(userTasks)
    }
  }, [address])

  if (!address || tasks.length === 0) return null

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Task History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your recent translation and review activities.
        </p>
      </div>
      <div className="border-t border-gray-200">
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
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
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