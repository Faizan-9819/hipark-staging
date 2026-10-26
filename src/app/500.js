export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Server Error
          </h2>
          <p className="text-gray-600 mb-6">
            We're experiencing some technical difficulties. Our team has been notified and is working to resolve the issue.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Try Again
          </button>
          
          <a
            href="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-md transition-colors"
          >
            Go to Homepage
          </a>
          
          <a
            href="/contact"
            className="block w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}