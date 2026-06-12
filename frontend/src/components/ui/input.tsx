import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex w-full min-w-[48px] border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-white text-gray-900 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:border-gray-200 disabled:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 dark:disabled:bg-gray-700 dark:disabled:border-gray-600 dark:text-white",
      },
      size: {
        default: "h-10 py-2 px-3",
        sm: "h-8 py-1.5 px-2",
        md: "h-9 py-1.5 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  variant,
  size,
  icon,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & { icon?: React.ReactNode }) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e)
    }
  }

  if (type === "search") {
    return (
      <div className="relative flex items-center border-2 border-gray-300 bg-white shadow-sm px-6 py-3 w-full focus-within:border-blue-500 group rounded-full">
        <span className="absolute left-3 text-gray-400">
          {icon || <Search className="w-5 h-5" />}
        </span>
        <input
          ref={inputRef}
          type="search"
          className={cn(
            "bg-transparent border-none outline-none w-full text-base placeholder:text-gray-400 focus:text-gray-900 pl-8",
            className
          )}
          placeholder="Search..."
          {...props}
          onChange={handleInputChange}
        />
      </div>
    )
  }

  if (icon) {
    return (
      <div className="relative w-full h-10 flex items-center bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </span>
        <input
          type={type}
          className={cn("w-full h-full bg-transparent border-none outline-none pl-10 pr-3 text-gray-900 placeholder:text-gray-400", className)}
          {...props}
        />
      </div>
    )
  }

  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Input }
