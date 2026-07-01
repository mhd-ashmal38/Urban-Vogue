import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2.5 border rounded-lg bg-white text-left",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "hover:border-gray-400",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-between gap-2",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
            className
          )}
        >
          <span className={cn(
            "text-sm",
            !selectedOption ? "text-gray-500" : "text-gray-900"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform flex-shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm transition-colors",
                    "flex items-center justify-between gap-2",
                    "hover:bg-gray-100",
                    value === option.value ? "bg-gray-100 text-gray-900" : "text-gray-900"
                  )}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
