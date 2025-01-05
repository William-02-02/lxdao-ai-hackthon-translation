'use client'

import { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface TranslationStatusProps {
  status: 'created' | 'in_progress' | 'completed' | 'failed'
  show: boolean
}

export default function TranslationStatus({ status, show }: TranslationStatusProps) {
  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed top-4 right-4 z-50">
        <div className={`rounded-lg p-4 shadow-lg ${
          status === 'completed' ? 'bg-green-50' :
          status === 'failed' ? 'bg-red-50' :
          'bg-blue-50'
        }`}>
          <div className="flex items-center">
            {status === 'completed' ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            ) : status === 'failed' ? (
              <XCircleIcon className="h-5 w-5 text-red-400" />
            ) : (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400" />
            )}
            <p className={`ml-3 text-sm font-medium ${
              status === 'completed' ? 'text-green-800' :
              status === 'failed' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {status === 'completed' ? 'Translation completed' :
               status === 'failed' ? 'Translation failed' :
               status === 'in_progress' ? 'Translating...' :
               'Initializing translation...'}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  )
} 