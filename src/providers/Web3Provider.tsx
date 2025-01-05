'use client'

import { createConfig, WagmiConfig, configureChains } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

// 创建一个 context 来管理 mock 状态
export const MockContext = createContext<{
  isMockConnected: boolean;
  mockAddress: string | null;
}>({
  isMockConnected: false,
  mockAddress: null,
})

// 定义本地 hardhat 链的配置
const hardhat = {
  id: 31337,
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
} as const

const { chains, publicClient } = configureChains(
  [process.env.NODE_ENV === 'development' ? hardhat : sepolia],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ 
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    })
  ],
  publicClient,
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mockState, setMockState] = useState({
    isMockConnected: false,
    mockAddress: null as string | null
  })

  // 在客户端初始化时检查 localStorage
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const savedAddress = localStorage.getItem('mock_address')
      setMockState({
        isMockConnected: !!savedAddress,
        mockAddress: savedAddress
      })
    }
  }, [])

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <MockContext.Provider value={mockState}>
          {children}
        </MockContext.Provider>
      </QueryClientProvider>
    </WagmiConfig>
  )
} 