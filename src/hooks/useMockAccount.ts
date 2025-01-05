'use client'

import { useContext } from 'react'
import { useAccount } from 'wagmi'
import { MockContext } from '@/src/providers/Web3Provider'

export function useMockAccount() {
  const { address: realAddress, isConnected: isRealConnected, ...rest } = useAccount()
  const { isMockConnected, mockAddress } = useContext(MockContext)

  // 如果是开发环境且有 mock 地址，优先使用 mock
  const isDev = process.env.NODE_ENV === 'development'
  const shouldUseMock = isDev && isMockConnected

  return {
    ...rest,
    address: shouldUseMock ? mockAddress : realAddress,
    isConnected: shouldUseMock ? true : isRealConnected,
    // 添加额外的属性以支持更灵活的使用
    realAddress,
    mockAddress,
    isMockConnected,
    isRealConnected,
  }
} 