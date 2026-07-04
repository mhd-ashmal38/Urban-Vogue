import { Skeleton } from './skeleton'

interface SkeletonCardProps {
  showImage?: boolean
  showTitle?: boolean
  showDescription?: boolean
  showFooter?: boolean
}

export default function SkeletonCard({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showFooter = true,
}: SkeletonCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      {showImage && (
        <Skeleton className="w-full h-48 rounded-md" />
      )}
      
      {showTitle && (
        <Skeleton className="h-6 w-3/4" />
      )}
      
      {showDescription && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      )}
      
      {showFooter && (
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      )}
    </div>
  )
}
