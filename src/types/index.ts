export * from './task'
export * from './review'
export * from './user'
export * from './stats'
export * from './earning'

// 通用类型
export interface PaginationParams {
  page: number
  limit: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export type TaskStatus = 'pending' | 'translating' | 'translated' | 'failed' | 'stopped' 