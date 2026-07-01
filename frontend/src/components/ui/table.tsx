import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface Column<T> {
  header: string
  key: string
  className?: string
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

export interface Action<T> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T, index: number) => void
  className?: string
  variant?: 'primary' | 'danger' | 'default'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  actions?: Action<T>[]
  emptyMessage?: string
  className?: string
  rowKey?: (row: T, index: number) => string
  height?: string
  pageSize?: number
}

export function Table<T>({
  columns,
  data,
  actions,
  emptyMessage = 'No data available',
  className,
  rowKey,
  height,
  pageSize = 10,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1)

  const getRowKey = (row: T, index: number) => {
    if (rowKey) return rowKey(row, index)
    if (typeof row === 'object' && row !== null && 'id' in row) {
      return (row as Record<string, unknown>).id as string
    }
    return index.toString()
  }

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = data.slice(startIndex, endIndex)
  const showPagination = data.length > pageSize

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const tableContent = (
    <table className="w-full">
      <thead className="bg-gray-50 flex-shrink-0">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={cn(
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.className
              )}
            >
              {column.header}
            </th>
          ))}
          {actions && actions.length > 0 && (
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)}
              className="px-6 py-12 text-center text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <tr key={getRowKey(row, startIndex + rowIndex)} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-6 py-4 whitespace-nowrap text-sm',
                    column.className
                  )}
                >
                  {column.render
                    ? column.render((row as Record<string, unknown>)[column.key], row, startIndex + rowIndex)
                    : (row as Record<string, unknown>)[column.key] as React.ReactNode}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.onClick(row, startIndex + rowIndex)}
                        className={cn(
                          'inline-flex items-center gap-1',
                          action.variant === 'danger' && 'text-red-600 hover:text-red-900',
                          action.variant === 'primary' && 'text-purple-600 hover:text-purple-900',
                          (!action.variant || action.variant === 'default') && 'text-gray-600 hover:text-gray-900',
                          action.className
                        )}
                      >
                        {action.icon}
                        {action.label && <span>{action.label}</span>}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )

  const paginationContent = showPagination && (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
      <div className="text-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  if (height) {
    return (
      <div className={cn('bg-white rounded-lg shadow-md overflow-hidden flex flex-col', className)} style={{ maxHeight: height }}>
        <div className="overflow-x-auto flex-1 overflow-y-auto">
          {tableContent}
        </div>
        {paginationContent}
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden', className)}>
      <div className="overflow-x-auto">
        {tableContent}
      </div>
      {paginationContent}
    </div>
  )
}
