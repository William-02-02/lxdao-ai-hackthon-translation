'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Task } from '@/src/types/task'
import { getTasks } from '@/src/mocks/data/tasks'
import { TrashIcon } from '@heroicons/react/24/outline'
import { deleteTaskFromStorage } from '@/src/services/storage'
import Toast from '@/src/components/common/Toast'

interface TaskListProps {
  tasks: Task[]
  onTasksChange?: () => void
}

export default function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const [toastConfig, setToastConfig] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  })
  
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setDeletingTaskId(taskId)
    try {
      const success = deleteTaskFromStorage(taskId)
      
      if (success) {
        setToastConfig({
          show: true,
          message: 'Task deleted successfully',
          type: 'success'
        })
        // 通知父组件更新任务列表
        if (onTasksChange) {
          onTasksChange()
        }
      } else {
        throw new Error('Failed to delete task')
      }
    } catch (error) {
      setToastConfig({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to delete task',
        type: 'error'
      })
    } finally {
      setDeletingTaskId(null)
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {tasks.map(task => (
          <li key={task.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex-1 min-w-0"
                >
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
                        Created at {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="ml-4 flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(task.id)
                    }}
                    disabled={deletingTaskId === task.id}
                    className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        show={toastConfig.show}
        onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
      />
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