import { Task } from '@/src/types/task'
import { TEST_ADDRESSES } from './users'

export const MOCK_COMPLETED_TASKS: Task[] = [
  // Active Translator 的任务
  {
    id: 'task-001',
    title: 'Ethereum 2.0 Technical Documentation',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 500,
    status: 'completed',
    createdAt: '2024-02-15T10:00:00Z',
    completedAt: '2024-02-18T15:30:00Z',
    createdBy: TEST_ADDRESSES.ADMIN,
    translatedBy: TEST_ADDRESSES.ACTIVE_TRANSLATOR,
    earnedAmount: 400,
    reviewScore: 95,
    paragraphs: [
      {
        id: 'p1',
        content: 'Original content about Ethereum 2.0...',
        translation: '关于以太坊2.0的翻译内容...',
        status: 'approved',
        reviewers: [TEST_ADDRESSES.SENIOR_REVIEWER]
      }
    ]
  },
  {
    id: 'task-002',
    title: 'DeFi Protocol Whitepaper',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 800,
    status: 'completed',
    createdAt: '2024-02-20T09:00:00Z',
    completedAt: '2024-02-23T16:45:00Z',
    createdBy: TEST_ADDRESSES.ADMIN,
    translatedBy: TEST_ADDRESSES.ACTIVE_TRANSLATOR,
    earnedAmount: 650,
    reviewScore: 92,
    paragraphs: [
      {
        id: 'p1',
        content: 'DeFi protocol introduction...',
        translation: 'DeFi协议介绍...',
        status: 'approved',
        reviewers: [TEST_ADDRESSES.SENIOR_REVIEWER]
      }
    ]
  },

  // Senior Reviewer 的任务
  {
    id: 'task-003',
    title: 'Layer 2 Scaling Solutions',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 1000,
    status: 'completed',
    createdAt: '2024-01-10T08:00:00Z',
    completedAt: '2024-01-15T17:20:00Z',
    createdBy: TEST_ADDRESSES.ADMIN,
    translatedBy: TEST_ADDRESSES.SENIOR_REVIEWER,
    earnedAmount: 850,
    reviewScore: 98,
    paragraphs: [
      {
        id: 'p1',
        content: 'Layer 2 scaling solutions overview...',
        translation: '二层扩容方案概述...',
        status: 'approved',
        reviewers: [TEST_ADDRESSES.ADMIN]
      }
    ]
  },

  // 中级译者的任务
  {
    id: 'task-004',
    title: 'NFT Marketplace Guide',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 600,
    status: 'completed',
    createdAt: '2024-03-01T10:00:00Z',
    completedAt: '2024-03-05T14:30:00Z',
    createdBy: TEST_ADDRESSES.ADMIN,
    translatedBy: TEST_ADDRESSES['0x2468...1357'],
    earnedAmount: 500,
    reviewScore: 88,
    paragraphs: [
      {
        id: 'p1',
        content: 'NFT marketplace user guide...',
        translation: 'NFT市场使用指南...',
        status: 'approved',
        reviewers: [TEST_ADDRESSES.SENIOR_REVIEWER]
      }
    ]
  },

  // 新晋审核者的任务
  {
    id: 'task-005',
    title: 'Smart Contract Security Best Practices',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 750,
    status: 'completed',
    createdAt: '2024-02-25T09:00:00Z',
    completedAt: '2024-03-01T11:45:00Z',
    createdBy: TEST_ADDRESSES.ADMIN,
    translatedBy: TEST_ADDRESSES['0x9876...5432'],
    earnedAmount: 600,
    reviewScore: 90,
    paragraphs: [
      {
        id: 'p1',
        content: 'Smart contract security guidelines...',
        translation: '智能合约安全指南...',
        status: 'approved',
        reviewers: [TEST_ADDRESSES.SENIOR_REVIEWER]
      }
    ]
  },

  // 资深译者兼审核者的任务
  {
    id: 'task-006',
    title: 'Zero Knowledge Proofs Explained',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 1200,
    status: 'completed',
    createdAt: '2024-01-20T08:00:00Z',
    completedAt: '2024-01-25T16:15:00Z',
    createdBy: TEST_ADDRESSES.ADMIN,
    translatedBy: TEST_ADDRESSES['0x3333...4444'],
    earnedAmount: 1000,
    reviewScore: 96,
    paragraphs: [
      {
        id: 'p1',
        content: 'Introduction to zero knowledge proofs...',
        translation: '零知识证明介绍...',
        status: 'approved',
        reviewers: [TEST_ADDRESSES.SENIOR_REVIEWER]
      }
    ]
  },

  // 高声誉审核者的任务
  {
    id: 'task-007',
    title: 'Blockchain Consensus Mechanisms',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 900,
    status: 'completed',
    createdAt: '2024-02-01T09:00:00Z',
    completedAt: '2024-02-05T15:30:00Z',
    createdBy: TEST_ADDRESSES.ADMIN,
    translatedBy: TEST_ADDRESSES['0x5555...6666'],
    earnedAmount: 750,
    reviewScore: 94,
    paragraphs: [
      {
        id: 'p1',
        content: 'Different consensus mechanisms comparison...',
        translation: '不同共识机制的比较...',
        status: 'approved',
        reviewers: [TEST_ADDRESSES.ADMIN]
      }
    ]
  }
] 