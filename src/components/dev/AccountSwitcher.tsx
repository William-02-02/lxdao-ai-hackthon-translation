'use client'

import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { MOCK_USERS, TEST_ADDRESSES } from '@/src/mocks/data/users'
import { useAccount } from 'wagmi'
import { useMockAccount } from '@/src/hooks/useMockAccount'

const mockAccounts = [
  { id: TEST_ADDRESSES.NEW_USER, name: 'New User', role: 'translator' },
  { id: TEST_ADDRESSES.ACTIVE_TRANSLATOR, name: 'Active Translator', role: 'translator' },
  { id: TEST_ADDRESSES.SENIOR_REVIEWER, name: 'Senior Reviewer', role: 'reviewer' },
  { id: TEST_ADDRESSES.ADMIN, name: 'Admin', role: 'admin' },
]

export default function AccountSwitcher() {
  const { address: realAddress, isConnected: isRealConnected } = useAccount()
  const { address, isMockConnected } = useMockAccount()
  const [selected, setSelected] = useState(mockAccounts[0])

  // 在客户端初始化时读取 localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('mock_address')
    const savedAccount = mockAccounts.find(acc => acc.id === savedAddress)
    if (savedAccount) {
      setSelected(savedAccount)
    }
  }, [])

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const handleChange = (account: typeof mockAccounts[0]) => {
    setSelected(account)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_address', account.id)
      window.location.reload()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-72 z-50">
      <div className="mb-2 text-sm text-gray-500">
        {isRealConnected && (
          <div>Real Wallet: {realAddress}</div>
        )}
        {isMockConnected && (
          <div>Mock Account Active</div>
        )}
      </div>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">
              {selected.name} ({selected.role})
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {mockAccounts.map((account) => (
                <Listbox.Option
                  key={account.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`
                  }
                  value={account}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {account.name} ({account.role})
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
} 