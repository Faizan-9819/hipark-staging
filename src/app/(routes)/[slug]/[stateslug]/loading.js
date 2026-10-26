export default function Loading() {
  return (
    <div className="w-full pt-[45px] pb-0 bg-white">
      <div className="fix">
        <div className="mb-0">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        </div>
        
        <div className="mt-[15px]">
          <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-8"></div>
        </div>

        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  )
}