import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import StatsSection from '@/src/components/home/StatsSection'
import FeatureSection from '@/src/components/home/FeatureSection'
import LatestTasks from '@/src/components/home/LatestTasks'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Decentralized Translation Platform
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Connect translators and reviewers worldwide, ensure quality through decentralized review process, 
          and earn rewards for your contributions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/tasks"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Browse Tasks
          </Link>
          <Link
            href="/tasks/create"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Create Task <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Latest Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Latest Translation Tasks
          </h2>
          <Link
            href="/tasks"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            View all tasks
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <LatestTasks />
      </div>
    </div>
  )
} 