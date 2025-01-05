import TaskDetail from '@/src/components/tasks/TaskDetail'
import { Suspense } from 'react'

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <TaskDetail taskId={params.id} />
      </Suspense>
    </div>
  )
} 