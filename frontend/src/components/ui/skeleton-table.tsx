import { Skeleton } from './skeleton'

interface SkeletonTableProps {
  rows?: number
  columns?: number
  showCheckbox?: boolean
  showActions?: boolean
}

export default function SkeletonTable({
  rows = 5,
  columns = 4,
  showCheckbox = true,
  showActions = true,
}: SkeletonTableProps) {
  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="flex items-center gap-4 mb-4">
        {showCheckbox && <Skeleton className="w-5 h-5" />}
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" style={{ maxWidth: `${100 / columns}%` }} />
        ))}
        {showActions && <Skeleton className="w-20 h-4" />}
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            {showCheckbox && <Skeleton className="w-5 h-5" />}
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className="h-4 flex-1" 
                style={{ 
                  maxWidth: `${100 / columns}%`,
                  height: colIndex === 0 ? 'h-5' : 'h-4',
                }} 
              />
            ))}
            {showActions && (
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
