import { Review } from '@/src/types'
import { TEST_ADDRESSES } from './users'

export const MOCK_COMPLETED_REVIEWS: Review[] = [
  // Senior Reviewer 的审核
  {
    id: 'review-001',
    taskId: 'task-001',
    taskTitle: 'Ethereum 2.0 Technical Documentation',
    paragraphId: 'p1',
    reviewer: TEST_ADDRESSES.SENIOR_REVIEWER,
    score: 95,
    comment: 'Technical terms are accurately translated, good work.',
    status: 'completed',
    createdAt: '2024-02-18T16:30:00Z',
    completedAt: '2024-02-18T17:30:00Z',
    earnedAmount: 100,
    translatedBy: TEST_ADDRESSES.ACTIVE_TRANSLATOR
  },
  {
    id: 'review-002',
    taskId: 'task-002',
    taskTitle: 'DeFi Protocol Whitepaper',
    paragraphId: 'p1',
    reviewer: TEST_ADDRESSES.SENIOR_REVIEWER,
    score: 92,
    comment: 'Good understanding of DeFi concepts, minor terminology improvements needed.',
    status: 'completed',
    createdAt: '2024-02-23T17:00:00Z',
    completedAt: '2024-02-23T18:15:00Z',
    earnedAmount: 120,
    translatedBy: TEST_ADDRESSES.ACTIVE_TRANSLATOR
  },

  // 新晋审核者的审核
  {
    id: 'review-003',
    taskId: 'task-004',
    taskTitle: 'NFT Marketplace Guide',
    paragraphId: 'p1',
    reviewer: TEST_ADDRESSES['0x9876...5432'],
    score: 88,
    comment: 'Generally good, but some NFT-specific terms could be more precise.',
    status: 'completed',
    createdAt: '2024-03-05T15:00:00Z',
    completedAt: '2024-03-05T16:00:00Z',
    earnedAmount: 80,
    translatedBy: TEST_ADDRESSES['0x2468...1357']
  },

  // 高声誉审核者的审核
  {
    id: 'review-004',
    taskId: 'task-006',
    taskTitle: 'Zero Knowledge Proofs Explained',
    paragraphId: 'p1',
    reviewer: TEST_ADDRESSES['0x5555...6666'],
    score: 96,
    comment: 'Excellent translation of complex ZK concepts. Very clear and accurate.',
    status: 'completed',
    createdAt: '2024-01-25T16:30:00Z',
    completedAt: '2024-01-25T17:45:00Z',
    earnedAmount: 150,
    translatedBy: TEST_ADDRESSES['0x3333...4444']
  },
  {
    id: 'review-005',
    taskId: 'task-007',
    taskTitle: 'Blockchain Consensus Mechanisms',
    paragraphId: 'p1',
    reviewer: TEST_ADDRESSES['0x5555...6666'],
    score: 94,
    comment: 'Very well explained consensus mechanisms, good technical accuracy.',
    status: 'completed',
    createdAt: '2024-02-05T16:00:00Z',
    completedAt: '2024-02-05T17:00:00Z',
    earnedAmount: 130,
    translatedBy: TEST_ADDRESSES.SENIOR_REVIEWER
  }
] 