import { useState } from 'react'
import { Search, Image, Loader2, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string, imageUrl?: string) => void
  isLoading?: boolean
  placeholder?: string
}

export default function SearchBar({ 
  onSearch, 
  isLoading = false, 
  placeholder = "Search for furniture..." 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() || imageUrl.trim()) {
      onSearch(query.trim(), imageUrl.trim() || undefined)
    }
  }

  const handleClear = () => {
    setQuery('')
    setImageUrl('')
    setShowImageInput(false)
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="input-field pl-10 pr-10"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Image URL Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Image className="h-4 w-4" />
            <span>{showImageInput ? 'Hide' : 'Add'} image URL</span>
          </button>
        </div>

        {/* Image URL Input */}
        {showImageInput && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input-field pl-10 pr-10"
              disabled={isLoading}
            />
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {imageUrl && !isValidUrl(imageUrl) && (
              <p className="text-xs text-red-600 mt-1">
                Please enter a valid URL
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading || (!query.trim() && !imageUrl.trim())}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </button>
          
          {(query || imageUrl) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Search Tips */}
      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium">Search tips:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Try: "modern office chair", "wooden dining table", "comfortable sofa"</li>
          <li>Add an image URL to find similar furniture</li>
          <li>Use specific materials: "leather", "wood", "metal"</li>
          <li>Include room types: "bedroom", "office", "living room"</li>
        </ul>
      </div>
    </div>
  )
}
