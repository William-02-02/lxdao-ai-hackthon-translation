import CompletedReviewsList from '@/src/components/profile/CompletedReviewsList'
import { Suspense } from 'react'

export default function CompletedReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Review History</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CompletedReviewsList />
      </Suspense>
    </div>
  )
} 