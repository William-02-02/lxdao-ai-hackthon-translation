'use client'

import { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { XCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
  onClose: () => void
}

export default function Toast({ message, type, show, onClose }: ToastProps) {
  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`rounded-lg p-4 shadow-lg ${
          type === 'success' ? 'bg-green-50' :
          type === 'error' ? 'bg-red-50' :
          'bg-blue-50'
        }`}>
          <div className="flex items-center">
            {type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            ) : type === 'error' ? (
              <XCircleIcon className="h-5 w-5 text-red-400" />
            ) : (
              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            )}
            <p className={`ml-3 text-sm font-medium ${
              type === 'success' ? 'text-green-800' :
              type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  )
} 