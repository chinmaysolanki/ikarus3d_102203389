import { useState, useRef, useEffect } from 'react'
import { ProductMetadata } from '@/lib/types'
import { Tag, ExternalLink, Loader2, Heart, Share2, Eye, Zap, Sparkles, Maximize2 } from 'lucide-react'
import { ApiError } from '@/lib/api'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

interface ProductCardProps {
  product: ProductMetadata
  onMoreLikeThis?: (productId: string) => void
  isLoading?: boolean
  index?: number
}

export default function ProductCard({ product, onMoreLikeThis, isLoading = false, index = 0 }: ProductCardProps) {
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Generate random smart insights for variety
  const smartInsights = [
    "Perfect for modern minimalist spaces",
    "Great for small apartments",
    "Eco-friendly material choice",
    "Trending in interior design",
    "Excellent value for money",
    "Popular among designers",
    "Versatile styling options",
    "Premium quality materials"
  ]

  const randomInsight = smartInsights[index % smartInsights.length]

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      setIsHovered(false)
    }

    if (isHovered) {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovered])

  const handleMoreLikeThis = async () => {
    if (!onMoreLikeThis) return
    
    setIsLoadingRelated(true)
    try {
      await onMoreLikeThis(product.uniq_id)
      toast.success('Found similar products!')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load similar products: ${error.message}`)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsLoadingRelated(false)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getPriceCategory = (price: number) => {
    if (price < 100) return { category: 'Budget', color: 'green', icon: '💰' }
    if (price < 500) return { category: 'Mid-range', color: 'blue', icon: '⭐' }
    if (price < 1000) return { category: 'Premium', color: 'purple', icon: '💎' }
    return { category: 'Luxury', color: 'gold', icon: '👑' }
  }

  const priceInfo = getPriceCategory(product.price)

  if (isLoading) {
    return (
      <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="aspect-w-16 aspect-h-12">
          <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div 
        ref={cardRef}
        className={clsx(
          "group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl",
          "transform-gpu will-change-transform"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: 'fadeInUp 0.6s ease-out forwards'
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
        {/* Smart Insight Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>Smart Pick</span>
          </div>
        </div>

        {/* Price Category Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className={clsx(
            "px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1",
            priceInfo.color === 'green' && "bg-green-500 text-white",
            priceInfo.color === 'blue' && "bg-blue-500 text-white",
            priceInfo.color === 'purple' && "bg-purple-500 text-white",
            priceInfo.color === 'gold' && "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
          )}>
            <span>{priceInfo.icon}</span>
            <span>{priceInfo.category}</span>
          </div>
        </div>

        {/* Product Image with Enhanced Effects */}
        <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
          {product.image_url ? (
            <>
              <img
                src={product.image_url}
                alt={product.title}
                className={clsx(
                  "w-full h-64 object-cover transition-all duration-700 group-hover:scale-110",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEgxMjBWMTIwSDgwVjgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Tag className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Image Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowQuickView(true)}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={handleLike}
                className={clsx(
                  "p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200",
                  isLiked 
                    ? "bg-red-500 text-white" 
                    : "bg-white/90 hover:bg-white text-gray-800"
                )}
              >
                <Heart className={clsx("h-5 w-5", isLiked && "fill-current")} />
              </button>
              <button
                onClick={handleShare}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info with Enhanced Styling */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {product.description}
            </p>
            
            {/* AI Insight */}
            <div className="mt-3 flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Zap className="h-3 w-3" />
              <span className="font-medium">{randomInsight}</span>
            </div>
          </div>

          {/* Enhanced Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {product.brand}
            </span>
            <span className={clsx(
              "px-3 py-1 rounded-full text-xs font-bold shadow-md",
              priceInfo.color === 'green' && "bg-green-500 text-white",
              priceInfo.color === 'blue' && "bg-blue-500 text-white",
              priceInfo.color === 'purple' && "bg-purple-500 text-white",
              priceInfo.color === 'gold' && "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
            )}>
              {formatPrice(product.price)}
            </span>
            {product.categories && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                {product.categories}
              </span>
            )}
            {product.material && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                {product.material}
              </span>
            )}
            {product.color && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                {product.color}
              </span>
            )}
          </div>

          {/* Dimensions with Icon */}
          {product.dimensions && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <Maximize2 className="h-3 w-3" />
              <span>{product.dimensions}</span>
            </div>
          )}

          {/* Enhanced Actions */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleMoreLikeThis}
              disabled={isLoadingRelated}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRelated ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Finding Similar...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  <span>More Like This</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {product.image_url && (
                <div className="mb-6">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <p className="text-gray-600">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleLike}
                      className={clsx(
                        "p-2 rounded-lg transition-all duration-200",
                        isLiked ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      <Heart className={clsx("h-5 w-5", isLiked && "fill-current")} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
