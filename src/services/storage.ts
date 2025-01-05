import { Task } from '@/src/types'
import { v4 as uuidv4 } from 'uuid'  // 需要安装 uuid 包

const TASKS_KEY = 'translation_dao_tasks'

// 获取所有任务
export function getAllTasksFromStorage(): Task[] {
  try {
    const tasksStr = localStorage.getItem(TASKS_KEY)
    if (!tasksStr) return []
    return JSON.parse(tasksStr)
  } catch (error) {
    console.error('Failed to get tasks:', error)
    return []
  }
}

// 保存新任务
export function saveTaskToStorage(task: Task) {
  try {
    // 确保任务有唯一 ID
    const taskWithId = {
      ...task,
      id: task.id || uuidv4()
    }

    const tasks = getAllTasksFromStorage()
    const updatedTasks = [...tasks, taskWithId]
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks))
    
    // 触发自定义事件
    window.dispatchEvent(new Event('tasksUpdated'))
    return taskWithId
  } catch (error) {
    console.error('Failed to save task:', error)
    throw error
  }
}

// 获取单个任务
export function getTaskFromStorage(id: string): Task | null {
  try {
    const tasks = getAllTasksFromStorage()
    return tasks.find(task => task.id === id) || null
  } catch (error) {
    console.error('Failed to get task:', error)
    return null
  }
}

// 更新任务
export function updateTaskInStorage(updatedTask: Task) {
  try {
    const tasks = getAllTasksFromStorage()
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    )
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks))
    
    // 触发自定义事件
    window.dispatchEvent(new Event('tasksUpdated'))
    return updatedTask
  } catch (error) {
    console.error('Failed to update task:', error)
    throw error
  }
}

// 删除任务
export function deleteTaskFromStorage(taskId: string): boolean {
  try {
    const tasks = getAllTasksFromStorage()
    const filteredTasks = tasks.filter(task => task.id !== taskId)
    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks))
    
    // 触发自定义事件
    window.dispatchEvent(new Event('tasksUpdated'))
    return true
  } catch (error) {
    console.error('Failed to delete task:', error)
    return false
  }
}

// 初始化存储
export function initializeStorage() {
  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify([]))
  }
} 