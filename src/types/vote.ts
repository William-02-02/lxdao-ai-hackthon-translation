export type VoteType = 'approve' | 'reject'

export interface Vote {
  id: string
  taskId: string
  paragraphId: string
  reviewId: string
  reviewerId: string
  voterId: string
  voteType: VoteType
  comment?: string
  createdAt: string
}

export interface VoteStats {
  approves: number
  rejects: number
  voters: string[]
  threshold: number
  isApproved: boolean
  isRejected: boolean
}

export interface VoteResult {
  paragraphId: string
  reviewId: string
  reviewerId: string
  stats: VoteStats
  votes: Vote[]
  status: 'pending' | 'approved' | 'rejected'
  lastVoteAt: string
}

// Mock accounts with active user state
export const MOCK_ACCOUNTS = {
  CREATOR: '0x123...789',
  REVIEWER_1: '0xabc...def',
  REVIEWER_2: '0x456...789',
  REVIEWER_3: '0x789...abc',
  VOTER_1: '0xdef...123',
  VOTER_2: '0x321...456',
  VOTER_3: '0x654...789',
  // 当前活跃用户
  activeUser: '0xdef...123', // 默认为 VOTER_1
  // 切换活跃用户
  setActiveUser(address: string) {
    this.activeUser = address
    // 触发自定义事件通知组件更新
    window.dispatchEvent(new CustomEvent('userChanged'))
  }
} 