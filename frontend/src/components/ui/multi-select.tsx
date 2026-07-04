import * as React from "react"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectProps {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
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

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Selected Items Display */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg bg-white",
            "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
            "hover:border-gray-400 cursor-pointer",
            "transition-all duration-200",
            "flex flex-wrap gap-2 items-center",
            error ? "border-red-500 focus:ring-red-500" : "",
            className
          )}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-sm"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => removeOption(option.value, e)}
                  className="hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 ml-auto transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "px-3 py-2 cursor-pointer hover:bg-purple-50 transition-colors",
                    "flex items-center gap-2",
                    value.includes(option.value) && "bg-purple-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 border-2 rounded flex items-center justify-center",
                      value.includes(option.value)
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300"
                    )}
                  >
                    {value.includes(option.value) && (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    )}
                  </div>
                  <span className="text-sm text-gray-900">{option.label}</span>
                </div>
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
