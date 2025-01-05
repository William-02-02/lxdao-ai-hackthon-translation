'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletIcon } from '@heroicons/react/24/outline'

export default function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
      >
        <WalletIcon className="h-5 w-5 mr-2" />
        {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
      </button>
    )
  }

  return (
    <button
      onClick={() => connect()}
      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
    >
      <WalletIcon className="h-5 w-5 mr-2" />
      Connect Wallet
    </button>
  )
} 