'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-red-600 mb-2">Oops!</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => reset()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-md transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}