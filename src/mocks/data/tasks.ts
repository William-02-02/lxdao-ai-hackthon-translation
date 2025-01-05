import { Task } from '@/src/types'
import { saveTaskToStorage, getAllTasks } from '@/src/services/storage'

export const MOCK_TASKS: Record<string, Task> = {
  '1': {
    // Pending状态 - 只有原文
    id: '1',
    title: 'Introduction to Zero-Knowledge Proofs',
    sourceContent: '...',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 800,
    status: 'pending',
    createdAt: '2024-03-21T09:00:00Z',
    createdBy: '0xabcd...efgh',
    paragraphs: [
      {
        id: 'p1',
        content: 'Zero-knowledge proofs are cryptographic methods that allow one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any information beyond the validity of the statement itself.',
        translation: null,
        status: 'pending',
        reviewers: []
      },
      {
        id: 'p2',
        content: 'This concept has become increasingly important in blockchain technology, particularly for privacy-preserving transactions and scalable computation.',
        translation: null,
        status: 'pending',
        reviewers: []
      }
    ]
  },
  '2': {
    // Translating状态 - 部分翻译完成
    id: '2',
    title: '区块链治理机制研究',
    sourceContent: '...',
    sourceLang: 'zh',
    targetLang: 'en',
    bounty: 1200,
    status: 'translating',
    createdAt: '2024-03-22T15:00:00Z',
    createdBy: '0x2468...1357',
    paragraphs: [
      {
        id: 'p1',
        content: '有效的治理机制是区块链项目成功的关键因素。治理涉及协议升级、参数调整和资源分配等重要决策。',
        translation: 'Effective governance mechanisms are key factors in the success of blockchain projects. Governance involves important decisions such as protocol upgrades, parameter adjustments, and resource allocation.',
        status: 'translated',
        reviewers: []
      },
      {
        id: 'p2',
        content: '链上治理通过智能合约实现自动化决策执行，提高了治理效率和透明度。',
        translation: null,
        status: 'pending',
        reviewers: []
      }
    ]
  },
  '3': {
    // Reviewing状态 - 部分已审核
    id: '3',
    title: 'Ethereum 2.0 Technical Documentation',
    sourceContent: '...',
    sourceLang: 'en',
    targetLang: 'zh',
    bounty: 1000,
    status: 'reviewing',
    createdAt: '2024-03-20T10:00:00Z',
    createdBy: '0x1234...5678',
    paragraphs: [
      {
        id: 'p1',
        content: 'Ethereum 2.0 represents a significant upgrade to the Ethereum network, focusing on scalability and sustainability. This upgrade aims to make Ethereum more efficient, secure, and sustainable while maintaining its decentralized nature.',
        translation: 'Ethereum 2.0 代表了以太坊网络的重大升级，专注于可扩展性和可持续性。此次升级旨在使以太坊更加高效、安全和可持续，同时保持其去中心化的特性。',
        status: 'approved',
        reviewers: ['0x7890...1234', '0x3333...4444', '0x5555...6666']
      },
      {
        id: 'p2',
        content: 'The main improvements include Proof of Stake and sharding. Proof of Stake significantly reduces energy consumption compared to Proof of Work, while sharding improves scalability by allowing parallel transaction processing.',
        translation: '主要改进包括权益证明和分片。与工作量证明相比，权益证明显著降低了能源消耗，而分片通过允许并行处理交易提高了可扩展性。',
        status: 'translated',
        reviewers: []
      }
    ]
  }
}

export function saveTask(task: Omit<Task, 'id'>): Task {
  const id = `task_${Date.now()}`
  const newTask: Task = {
    id,
    ...task,
    createdBy: '0x1234...5678',
    status: 'pending',
    translatedBy: undefined,
    reviewedBy: [],
    reviewScore: undefined
  }
  
  // 保存到本地存储
  saveTaskToStorage(newTask)
  return newTask
}

export function getTasks(): Record<string, Task> {
  return getAllTasks()
} 