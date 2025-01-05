import { Review } from '../../types/review'

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    taskId: '3',
    paragraphId: 'p1',
    reviewer: '0x7890...1234',
    approved: true,
    comment: 'Translation is accurate and maintains the technical meaning.',
    createdAt: '2024-03-21T11:00:00Z'
  },
  {
    id: '2',
    taskId: '3',
    paragraphId: 'p1',
    reviewer: '0x3333...4444',
    approved: true,
    comment: 'Good translation, terminology is consistent.',
    createdAt: '2024-03-21T12:30:00Z'
  }
] 