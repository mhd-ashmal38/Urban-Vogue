import * as React from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Small } from "./typography"

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  onUpload: () => void
  selectedFiles: File[]
  uploadedFiles: string[]
  onRemoveSelected: (index: number) => void
  onRemoveUploaded: (index: number) => void
  uploading?: boolean
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
  className?: string
}

export function FileUpload({
  onFilesChange,
  onUpload,
  selectedFiles,
  uploadedFiles,
  onRemoveSelected,
  onRemoveUploaded,
  uploading = false,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = "image/*",
  className,
}: FileUploadProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    const totalFiles = selectedFiles.length + newFiles.length

    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. You currently have ${selectedFiles.length} selected.`)
      return
    }

    // Check file sizes
    const oversizedFiles = newFiles.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    )
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit`)
      return
    }

    onFilesChange([...selectedFiles, ...newFiles])
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Choose files
          </label>
          <Small className="text-gray-500 mt-2">
            Max {maxFiles} files, {maxSizeMB}MB each
          </Small>
        </div>
      </div>

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <Button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
          <Small className="text-gray-500">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
          </Small>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Files</p>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => onRemoveSelected(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</p>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file}
                  alt={`Uploaded ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => onRemoveUploaded(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
