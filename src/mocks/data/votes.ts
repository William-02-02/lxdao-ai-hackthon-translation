import { Vote } from '../../types/vote'

export const MOCK_VOTES: Vote[] = [
  {
    id: '1',
    taskId: '3',
    paragraphId: 'p1',
    voter: '0x7890...1234',
    voteType: 'approve',
    comment: 'Translation is accurate and maintains the technical meaning.',
    createdAt: '2024-03-21T11:00:00Z'
  },
  {
    id: '2',
    taskId: '3',
    paragraphId: 'p1',
    voter: '0x3333...4444',
    voteType: 'approve',
    comment: 'Good translation, terminology is consistent.',
    createdAt: '2024-03-21T12:30:00Z'
  },
  {
    id: '3',
    taskId: '3',
    paragraphId: 'p1',
    voter: '0x5555...6666',
    voteType: 'approve',
    comment: 'Approved. The translation conveys the original meaning well.',
    createdAt: '2024-03-21T14:20:00Z'
  },
  {
    id: '4',
    taskId: '3',
    paragraphId: 'p2',
    voter: '0x7890...1234',
    voteType: 'approve',
    comment: 'Technical terms are translated correctly.',
    createdAt: '2024-03-21T15:00:00Z'
  },
  {
    id: '5',
    taskId: '3',
    paragraphId: 'p2',
    voter: '0x3333...4444',
    voteType: 'reject',
    comment: 'The translation of "sharding" could be more precise.',
    createdAt: '2024-03-21T15:30:00Z'
  }
]

// 在 mockApi 中添加
export const mockApi = {
  // ... 其他方法
  async getTaskVotes(taskId: string): Promise<Vote[]> {
    return MOCK_VOTES.filter(vote => vote.taskId === taskId)
  }
} 