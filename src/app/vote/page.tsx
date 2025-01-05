'use client'

import VoteTaskList from '@/src/components/vote/VoteTaskList'

export default function VotePage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Vote on Reviews</h1>
        <p className="mt-2 text-sm text-gray-600">
          Review and vote on translations that have been reviewed by others.
          Your vote helps ensure the quality of translations through community consensus.
        </p>
      </div>
      
      <div className="mt-6">
        <VoteTaskList />
      </div>
    </div>
  )
} 