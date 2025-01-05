'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Task } from '@/src/types/task'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { getAllTasksFromStorage } from '@/src/services/storage'

export default function ReviewTaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // 从存储中加载任务并过滤出正在审核的任务
    const allTasks = getAllTasksFromStorage()
    console.log('All tasks:', allTasks)
    const reviewingTasks = allTasks.filter(task => task.status === 'reviewing')
    console.log('Reviewing tasks:', reviewingTasks)
    setTasks(reviewingTasks)

    // 监听任务更新事件
    const handleTasksUpdated = () => {
      const updatedTasks = getAllTasksFromStorage()
      console.log('Updated tasks:', updatedTasks)
      const updatedReviewingTasks = updatedTasks.filter(task => task.status === 'reviewing')
      console.log('Updated reviewing tasks:', updatedReviewingTasks)
      setTasks(updatedReviewingTasks)
    }

    window.addEventListener('tasksUpdated', handleTasksUpdated)
    return () => {
      window.removeEventListener('tasksUpdated', handleTasksUpdated)
    }
  }, [])

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks to review</h3>
        <p className="mt-1 text-sm text-gray-500">
          There are currently no tasks ready for review.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id}>
            <Link href={`/review/${task.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {task.title}
                    </p>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span>
                          {task.paragraphs.length} paragraphs to review
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">{task.bounty} USDT</span>
                      <span className="mx-2">•</span>
                      <span>{getParagraphProgress(task)}</span>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
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

function getParagraphProgress(task: Task): string {
  const reviewed = task.paragraphs.filter(p => 
    p.status === 'approved' || p.status === 'rejected'
  ).length
  return `${reviewed}/${task.paragraphs.length} reviewed`
} 