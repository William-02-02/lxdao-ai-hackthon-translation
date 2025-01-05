import { Earning } from '@/src/types'
import { TEST_ADDRESSES } from './users'

export const MOCK_EARNINGS: Earning[] = [
  // Active Translator 的收益
  {
    id: 'earn-001',
    taskId: 'task-001',
    taskTitle: 'Ethereum 2.0 Technical Documentation',
    type: 'translation',
    amount: 400,
    status: 'completed',
    createdAt: '2024-02-18T15:30:00Z',
    address: TEST_ADDRESSES.ACTIVE_TRANSLATOR,
    details: {
      wordCount: 2000,
      ratePerWord: 0.2,
    }
  },
  {
    id: 'earn-002',
    taskId: 'task-002',
    taskTitle: 'DeFi Protocol Whitepaper',
    type: 'translation',
    amount: 650,
    status: 'completed',
    createdAt: '2024-02-23T16:45:00Z',
    address: TEST_ADDRESSES.ACTIVE_TRANSLATOR,
    details: {
      wordCount: 3250,
      ratePerWord: 0.2,
    }
  },

  // Senior Reviewer 的收益
  {
    id: 'earn-003',
    taskId: 'task-001',
    taskTitle: 'Ethereum 2.0 Technical Documentation',
    type: 'review',
    amount: 100,
    status: 'completed',
    createdAt: '2024-02-18T17:30:00Z',
    address: TEST_ADDRESSES.SENIOR_REVIEWER,
    details: {
      reviewedParagraphs: 5,
      ratePerParagraph: 20,
    }
  },
  {
    id: 'earn-004',
    taskId: 'task-003',
    taskTitle: 'Layer 2 Scaling Solutions',
    type: 'translation',
    amount: 850,
    status: 'completed',
    createdAt: '2024-01-15T17:20:00Z',
    address: TEST_ADDRESSES.SENIOR_REVIEWER,
    details: {
      wordCount: 4250,
      ratePerWord: 0.2,
    }
  },

  // 高声誉审核者的收益
  {
    id: 'earn-005',
    taskId: 'task-006',
    taskTitle: 'Zero Knowledge Proofs Explained',
    type: 'review',
    amount: 150,
    status: 'completed',
    createdAt: '2024-01-25T17:45:00Z',
    address: TEST_ADDRESSES['0x5555...6666'],
    details: {
      reviewedParagraphs: 6,
      ratePerParagraph: 25,
    }
  },
  {
    id: 'earn-006',
    taskId: 'task-007',
    taskTitle: 'Blockchain Consensus Mechanisms',
    type: 'review',
    amount: 130,
    status: 'completed',
    createdAt: '2024-02-05T17:00:00Z',
    address: TEST_ADDRESSES['0x5555...6666'],
    details: {
      reviewedParagraphs: 5,
      ratePerParagraph: 26,
    }
  }
] 