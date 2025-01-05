import ReviewTaskList from '@/src/components/review/ReviewTaskList'
import { Suspense } from 'react'

export default function ReviewPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Review Tasks</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and vote on translated content to earn bounties
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewTaskList />
      </Suspense>
    </div>
  )
} 