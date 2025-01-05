import CreateTaskForm from '@/src/components/tasks/CreateTaskForm'

export default function CreateTaskPage() {
  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Task</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new translation task and set bounty for translators and reviewers.
        </p>
      </div>
      <div className="mt-6 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <CreateTaskForm />
        </div>
      </div>
    </div>
  )
} 