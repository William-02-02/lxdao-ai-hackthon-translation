import { User } from '../../types/user'

export const MOCK_USERS: { [key: string]: User } = {
  // 活跃译者
  '0x1234...5678': {
    address: '0x1234...5678',
    role: 'translator',
    reputation: 95,
    completedTasks: 12,
    completedReviews: 0,
    totalEarned: 5000
  },
  // 资深审核者
  '0x7890...1234': {
    address: '0x7890...1234',
    role: 'reviewer',
    reputation: 98,
    completedTasks: 25,
    completedReviews: 45,
    totalEarned: 8500
  },
  // 新手译者
  '0xabcd...efgh': {
    address: '0xabcd...efgh',
    role: 'translator',
    reputation: 100,
    completedTasks: 0,
    completedReviews: 0,
    totalEarned: 0
  },
  // 资深译者兼审核者
  '0x3333...4444': {
    address: '0x3333...4444',
    role: 'reviewer',
    reputation: 92,
    completedTasks: 18,
    completedReviews: 30,
    totalEarned: 6500
  },
  // 高声誉审核者
  '0x5555...6666': {
    address: '0x5555...6666',
    role: 'reviewer',
    reputation: 99,
    completedTasks: 8,
    completedReviews: 65,
    totalEarned: 9000
  },
  // 中级译者
  '0x2468...1357': {
    address: '0x2468...1357',
    role: 'translator',
    reputation: 88,
    completedTasks: 6,
    completedReviews: 0,
    totalEarned: 2800
  },
  // 新晋审核者
  '0x9876...5432': {
    address: '0x9876...5432',
    role: 'reviewer',
    reputation: 90,
    completedTasks: 15,
    completedReviews: 10,
    totalEarned: 4200
  },
  // 管理员
  '0xadmin...1111': {
    address: '0xadmin...1111',
    role: 'admin',
    reputation: 100,
    completedTasks: 0,
    completedReviews: 100,
    totalEarned: 15000
  }
}

// 为了方便测试，添加一些常用的测试地址
export const TEST_ADDRESSES = {
  NEW_USER: '0xabcd...efgh',
  ACTIVE_TRANSLATOR: '0x1234...5678',
  SENIOR_REVIEWER: '0x7890...1234',
  ADMIN: '0xadmin...1111'
} 