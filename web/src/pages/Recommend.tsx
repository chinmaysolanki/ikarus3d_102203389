import { useState, useEffect } from 'react'
import { ProductMetadata, RecommendRequest } from '@/lib/types'
import { apiClient, ApiError } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import { ThinkingChips } from '@/components/ThinkingChips'
import RoomPlanner from '@/components/RoomPlanner'
import StyleRecommendations from '@/components/StyleRecommendations'
import { Clock, AlertCircle, Sparkles, Search, Grid3X3, Palette, Zap, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

export default function Recommend() {
  const [products, setProducts] = useState<ProductMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTime, setSearchTime] = useState<number | null>(null)
  const [reasons, setReasons] = useState<string[]>([])
  const [lastQuery, setLastQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'discover' | 'planner' | 'styles'>('discover')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalFound, setTotalFound] = useState(0)
  const [pageSize] = useState(8)

  // Load initial recommendations on mount
  useEffect(() => {
    handleSearch('modern furniture')
  }, [])

  const handleSearch = async (query: string, imageUrl?: string, page: number = 1) => {
    setIsLoading(true)
    setLastQuery(query)
    setCurrentPage(page)
    
    try {
      const request: RecommendRequest = {
        query,
        k: 50, // Maximum allowed by backend validation
        page,
        size: pageSize,
        filters: {},
        user_image_url: imageUrl,
        include_description: true,
        include_reason: true,
      }

      const response = await apiClient.recommend(request)
      
      setProducts(response.products)
      setTotalPages(response.total_pages)
      setTotalFound(response.total_found)
      setSearchTime(response.search_time_ms)
      setReasons(response.reasons || [])
      
      toast.success(`Found ${response.total_found} products!`)
    } catch (error) {
      console.error('Search error:', error)
      const message = error instanceof ApiError ? error.message : 'Search failed'
      toast.error(message)
      setProducts([])
      setReasons([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoreLikeThis = async (productId: string) => {
    const product = products.find(p => p.uniq_id === productId)
    if (!product) return

    const query = `${product.title} ${product.categories}`
    await handleSearch(query)
  }

  const handlePageChange = (page: number) => {
    handleSearch(lastQuery, undefined, page)
  }

  const tabs = [
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'planner', label: 'Room Planner', icon: Grid3X3 },
    { id: 'styles', label: 'Style Guide', icon: Palette },
  ] as const

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Furniture Studio
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-6">
          Discover your perfect furniture with smart recommendations
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Smart Search</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Smart Matching</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Data Insights</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'discover' && (
        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <ThinkingChips />
              <p className="text-gray-600 mt-4">Finding your perfect furniture...</p>
            </div>
          )}

          {/* Results Section */}
          {!isLoading && products.length > 0 && (
            <>
              {/* Results Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {totalFound} Products Found
                    </h2>
                    {searchTime && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{searchTime}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.uniq_id}
                    product={product}
                    index={index}
                    onMoreLikeThis={() => handleMoreLikeThis(product.uniq_id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Search Context */}
              {lastQuery && (
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Search className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-blue-900 mb-1">
                        Search Context
                      </h3>
                      <p className="text-sm text-blue-800">
                        Showing results for: <span className="font-medium">"{lastQuery}"</span>
                      </p>
                      {reasons.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-blue-900">Why these recommendations:</p>
                          <ul className="text-xs text-blue-800 space-y-1">
                            {reasons.slice(0, 3).map((reason, index) => (
                              <li key={index} className="flex items-start space-x-1">
                                <span className="text-blue-600">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && lastQuery && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Room Planner Tab */}
      {activeTab === 'planner' && (
        <div className="max-w-6xl mx-auto">
          <RoomPlanner />
        </div>
      )}

      {/* Style Recommendations Tab */}
      {activeTab === 'styles' && (
        <div className="max-w-6xl mx-auto">
          <StyleRecommendations 
            userPreferences={{
              budget: 'mid',
              roomType: 'Living Room',
              favoriteColors: ['blue', 'white', 'gray']
            }}
          />
        </div>
      )}
    </div>
  )
}