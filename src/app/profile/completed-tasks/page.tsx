import CompletedTasksList from '@/src/components/profile/CompletedTasksList'
import { Suspense } from 'react'

export default function CompletedTasksPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Completed Tasks History</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CompletedTasksList />
      </Suspense>
    </div>
  )
} 