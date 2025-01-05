export type UserRole = 'translator' | 'reviewer' | 'admin'

export interface User {
  address: string
  role: UserRole
  reputation: number
  completedTasks?: number
  completedReviews?: number
  totalEarned: number
} 