'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useMockAccount } from '@/src/hooks/useMockAccount'
import { User } from '@/src/types'
import { mockApi } from '@/src/mocks'

export default function ProfileInfo() {
  const { address: realAddress } = useAccount()
  const { address, isConnected } = useMockAccount()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (address) {
      mockApi.getUser(address).then(userData => {
        if (userData) {
          setUser(userData)
        } else {
          setUser({
            address,
            role: 'translator',
            reputation: 100,
            completedTasks: 0,
            completedReviews: 0,
            totalEarned: 0
          })
        }
      })
    }
  }, [address])

  if (!isConnected) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <p className="text-gray-500">Please connect your wallet to view profile</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {user.completedTasks === 0 && user.completedReviews === 0 
                ? "Welcome! Start your translation journey by browsing available tasks."
                : "Your personal information and role."}
            </p>
          </div>
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${user.role === 'translator' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}
          `}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Wallet Address</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{address}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Reputation Score</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {user.reputation}
              {user.reputation === 100 && (
                <span className="ml-2 text-xs text-gray-500">(Initial score)</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
      {user.completedTasks === 0 && user.completedReviews === 0 && (
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-blue-50">
          <h4 className="text-sm font-medium text-blue-800">Getting Started</h4>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• Browse available translation tasks</li>
            <li>• Start with smaller tasks to build reputation</li>
            <li>• Complete tasks to unlock reviewer role</li>
            <li>• Earn rewards for quality translations</li>
          </ul>
        </div>
      )}
    </div>
  )
} 