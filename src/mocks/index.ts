import { MOCK_TASKS } from './data/tasks'
import { MOCK_REVIEWS } from './data/reviews'
import { MOCK_USERS } from './data/users'
import { MOCK_STATS } from './data/stats'
import { MOCK_VOTES } from './data/votes'
import { Vote } from '../types/vote'
import { TEST_ADDRESSES } from './data/users'

const getMockAddress = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('mock_address') || TEST_ADDRESSES.NEW_USER
}

// 如果需要模拟 API 调用，可以添加以下函数
export const mockApi = {
  async getTask(id: string) {
    return MOCK_TASKS[id]
  },

  async getTaskReviews(taskId: string) {
    return MOCK_REVIEWS.filter(review => review.taskId === taskId)
  },

  async getUser(address: string) {
    const mockAddress = process.env.NODE_ENV === 'development' ? getMockAddress() : address
    return MOCK_USERS[mockAddress] || null
  },

  async getPlatformStats() {
    return MOCK_STATS
  },

  async getTaskVotes(taskId: string): Promise<Vote[]> {
    return MOCK_VOTES.filter(vote => vote.taskId === taskId)
  }
} 