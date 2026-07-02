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

export interface BulkAction<T> {
  label: string
  icon?: React.ReactNode
  onClick: (selectedRows: T[]) => void
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
  selectable?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
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
  selectable = false,
  onSelectionChange,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = React.useState(false)

  const getRowKey = React.useCallback((row: T, index: number) => {
    if (rowKey) return rowKey(row, index)
    if (typeof row === 'object' && row !== null && 'id' in row) {
      return (row as Record<string, unknown>).id as string
    }
    return index.toString()
  }, [rowKey])

  // Notify parent when selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedData = data.filter((row, idx) => selectedRows.has(getRowKey(row, idx)))
      onSelectionChange(selectedData)
    }
  }, [selectedRows, data, onSelectionChange, getRowKey])

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = data.slice(startIndex, endIndex)
  const showPagination = data.length > pageSize

  // Reset to first page if current page is empty after data changes
  React.useEffect(() => {
    ;(async () => {
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages)
      } else if (currentPage > 1 && startIndex >= data.length) {
        setCurrentPage(Math.max(1, totalPages))
      }
    })()
  }, [data.length, currentPage, totalPages, startIndex])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handleRowSelect = (rowKey: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey)
      } else {
        newSet.add(rowKey)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((row, idx) => getRowKey(row, startIndex + idx))))
    }
    setSelectAll(!selectAll)
  }

  const tableContent = (
    <table className="w-full">
      <thead className="bg-gray-50 flex-shrink-0">
        <tr>
          {selectable && (
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectAll && selectedRows.size === paginatedData.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
            </th>
          )}
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
              colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0) + (selectable ? 1 : 0)}
              className="px-6 py-12 text-center text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <tr key={getRowKey(row, startIndex + rowIndex)} className="hover:bg-gray-50">
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(getRowKey(row, startIndex + rowIndex))}
                    onChange={() => handleRowSelect(getRowKey(row, startIndex + rowIndex))}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                </td>
              )}
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
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 flex-shrink-0">
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{startIndex + 1}</span> to{' '}
        <span className="font-medium text-gray-900">{Math.min(endIndex, data.length)}</span> of{' '}
        <span className="font-medium text-gray-900">{data.length}</span> results
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  'w-10 h-10 rounded-lg text-sm font-medium transition-colors border',
                  currentPage === pageNum
                    ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                )}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  )

  if (height) {
    return (
      <div className={cn('bg-white rounded-lg shadow-md overflow-hidden flex flex-col', className)} style={{ maxHeight: height }}>
        <div className="overflow-x-auto flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {selectable && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll && selectedRows.size === paginatedData.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                  </th>
                )}
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
                    colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0) + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr key={getRowKey(row, startIndex + rowIndex)} className="hover:bg-gray-50">
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(getRowKey(row, startIndex + rowIndex))}
                          onChange={() => handleRowSelect(getRowKey(row, startIndex + rowIndex))}
                          className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                      </td>
                    )}
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
