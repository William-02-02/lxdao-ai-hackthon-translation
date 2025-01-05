'use client'

import { useState, useEffect } from 'react'
import TaskList from '@/src/components/tasks/TaskList'
import CreateTaskButton from '@/src/components/tasks/CreateTaskButton'
import { getAllTasksFromStorage } from '@/src/services/storage'
import { Task } from '@/src/types'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const loadTasks = () => {
    const allTasks = getAllTasksFromStorage()
    setTasks(allTasks)
  }

  useEffect(() => {
    loadTasks()

    // 监听存储变化和自定义事件
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'translation_dao_tasks') {
        loadTasks()
      }
    }

    const handleTasksUpdated = () => {
      loadTasks()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('tasksUpdated', handleTasksUpdated)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('tasksUpdated', handleTasksUpdated)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Translation Tasks</h1>
        <CreateTaskButton />
      </div>
      <div className="mt-8">
        <TaskList 
          tasks={tasks} 
          onTasksChange={loadTasks}
        />
      </div>
    </div>
  )
} 