'use client'

import { useState } from 'react'
import { testCozeAPI } from '@/src/utils/test-coze'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function CozeTestTool() {
  const [testing, setTesting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setError(null)
    setStreamContent('')
    setShowModal(true)

    try {
      const { success, content } = await testCozeAPI({
        onStream: (text) => {
          setStreamContent(prev => prev + text)
        }
      })

      if (!success) {
        setError('API connection test failed')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setTesting(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Coze API Test Tool</h3>
          <button
            onClick={handleTest}
            disabled={testing}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* 背景遮罩 */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => !testing && setShowModal(false)}
            />

            {/* 模态框内容 */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    API Test Result
                  </h3>
                  {!testing && (
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  {testing && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2" />
                      Testing API connection...
                    </div>
                  )}
                  {error && (
                    <div className="text-sm text-red-600">
                      {error}
                    </div>
                  )}
                  {streamContent && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500 mb-2">Response:</div>
                      <div className="bg-gray-50 rounded-md p-3 font-mono text-sm whitespace-pre-wrap">
                        {streamContent}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={testing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 