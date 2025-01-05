import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="mb-8">
            <Link href="/" className="text-indigo-600 hover:text-indigo-900">
              ← Back to Home
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
} 