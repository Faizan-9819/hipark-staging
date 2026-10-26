'use client'

export default function Error({ error, reset }) {
  console.error('Microblog route error:', error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Content Unavailable
        </h2>
        <p className="text-gray-600 mb-6">
          We're having trouble loading this microblog content. Please try again or go back to the homepage.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}