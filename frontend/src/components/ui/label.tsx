import * as React from "react"
import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "block text-sm font-semibold text-gray-700 mb-2",
        className
      )}
      {...props}
    />
  )
}

export { Label }
