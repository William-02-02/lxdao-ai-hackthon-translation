import ReviewTask from '@/src/components/review/ReviewTask'
import { Suspense } from 'react'

export default function ReviewTaskPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewTask taskId={params.id} />
      </Suspense>
    </div>
  )
} 