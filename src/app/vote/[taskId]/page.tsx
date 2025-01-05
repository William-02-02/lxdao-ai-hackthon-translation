'use client'

import VoteTask from '@/src/components/vote/VoteTask'

interface VoteTaskPageProps {
  params: {
    taskId: string
  }
}

export default function VoteTaskPage({ params }: VoteTaskPageProps) {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <VoteTask taskId={params.taskId} />
    </div>
  )
} 