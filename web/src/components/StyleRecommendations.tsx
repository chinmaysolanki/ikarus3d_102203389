import { useState, useEffect } from 'react'
import { Sparkles, Palette, Home, TrendingUp, Star, Zap, Lightbulb, Target, Users, Award } from 'lucide-react'
import { clsx } from 'clsx'

interface StyleRecommendation {
  id: string
  name: string
  description: string
  colorScheme: string[]
  furniture: string[]
  accessories: string[]
  mood: string
  confidence: number
  trending: boolean
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury'
  roomType: string
}

interface StyleRecommendationsProps {
  userPreferences?: {
    favoriteColors?: string[]
    budget?: 'budget' | 'mid' | 'premium' | 'luxury'
    roomType?: string
    style?: string
  }
}

export default function StyleRecommendations({ userPreferences }: StyleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  // AI-generated style recommendations
  const generateRecommendations = () => {
    const baseStyles: StyleRecommendation[] = [
      {
        id: 'modern-minimalist',
        name: 'Modern Minimalist',
        description: 'Clean lines, neutral colors, and functional design create a serene, uncluttered space.',
        colorScheme: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E'],
        furniture: ['Sleek sofa', 'Glass coffee table', 'Minimalist dining set', 'Floating shelves'],
        accessories: ['Abstract art', 'Indoor plants', 'Geometric rugs', 'LED lighting'],
        mood: 'Calm & Focused',
        confidence: 95,
        trending: true,
        priceRange: 'mid',
        roomType: 'Living Room'
      },
      {
        id: 'scandinavian-cozy',
        name: 'Scandinavian Cozy',
        description: 'Warm woods, soft textures, and hygge-inspired elements for ultimate comfort.',
        colorScheme: ['#F7F3E9', '#E8D5B7', '#D4A574', '#8B4513'],
        furniture: ['Wooden dining table', 'Cozy armchair', 'Storage bench', 'Bookshelf'],
        accessories: ['Wool throws', 'Candles', 'Wooden bowls', 'Textured pillows'],
        mood: 'Warm & Inviting',
        confidence: 92,
        trending: true,
        priceRange: 'mid',
        roomType: 'Living Room'
      },
      {
        id: 'industrial-loft',
        name: 'Industrial Loft',
        description: 'Raw materials, exposed elements, and urban aesthetics for a bold statement.',
        colorScheme: ['#2C2C2C', '#4A4A4A', '#8B8B8B', '#C0C0C0'],
        furniture: ['Metal dining table', 'Leather sofa', 'Industrial shelving', 'Steel coffee table'],
        accessories: ['Exposed bulbs', 'Metal art', 'Concrete planters', 'Vintage signs'],
        mood: 'Bold & Edgy',
        confidence: 88,
        trending: false,
        priceRange: 'premium',
        roomType: 'Living Room'
      },
      {
        id: 'bohemian-eclectic',
        name: 'Bohemian Eclectic',
        description: 'Rich patterns, vibrant colors, and global influences create a free-spirited space.',
        colorScheme: ['#8B4513', '#D2691E', '#CD853F', '#F4A460'],
        furniture: ['Vintage sofa', 'Rattan chair', 'Low coffee table', 'Floor cushions'],
        accessories: ['Macrame wall art', 'Patterned rugs', 'Poufs', 'Hanging plants'],
        mood: 'Creative & Free',
        confidence: 90,
        trending: true,
        priceRange: 'budget',
        roomType: 'Living Room'
      },
      {
        id: 'luxury-contemporary',
        name: 'Luxury Contemporary',
        description: 'High-end materials, sophisticated design, and premium finishes for elegant living.',
        colorScheme: ['#000000', '#FFFFFF', '#C0C0C0', '#8B4513'],
        furniture: ['Designer sofa', 'Marble coffee table', 'Premium dining set', 'Custom shelving'],
        accessories: ['Crystal chandelier', 'Art collection', 'Luxury rugs', 'Premium lighting'],
        mood: 'Elegant & Sophisticated',
        confidence: 94,
        trending: false,
        priceRange: 'luxury',
        roomType: 'Living Room'
      },
      {
        id: 'coastal-breeze',
        name: 'Coastal Breeze',
        description: 'Light blues, whites, and natural textures evoke seaside serenity.',
        colorScheme: ['#87CEEB', '#F0F8FF', '#B0E0E6', '#4682B4'],
        furniture: ['White sofa', 'Rattan chair', 'Driftwood table', 'Wicker storage'],
        accessories: ['Seashells', 'Nautical art', 'Linen curtains', 'Rope accents'],
        mood: 'Relaxed & Fresh',
        confidence: 87,
        trending: true,
        priceRange: 'mid',
        roomType: 'Living Room'
      }
    ]

    // Filter based on user preferences
    let filtered = baseStyles
    if (userPreferences?.budget) {
      filtered = filtered.filter(style => style.priceRange === userPreferences.budget)
    }
    if (userPreferences?.roomType) {
      filtered = filtered.filter(style => style.roomType === userPreferences.roomType)
    }

    // Sort by confidence and trending
    filtered.sort((a, b) => {
      if (a.trending && !b.trending) return -1
      if (!a.trending && b.trending) return 1
      return b.confidence - a.confidence
    })

    return filtered
  }

  useEffect(() => {
    setIsLoading(true)
    // Simulate AI processing time
    setTimeout(() => {
      setRecommendations(generateRecommendations())
      setIsLoading(false)
    }, 1500)
  }, [userPreferences])

  const getPriceRangeColor = (range: string) => {
    switch (range) {
      case 'budget': return 'bg-green-500'
      case 'mid': return 'bg-blue-500'
      case 'premium': return 'bg-purple-500'
      case 'luxury': return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      default: return 'bg-gray-500'
    }
  }

  const getPriceRangeIcon = (range: string) => {
    switch (range) {
      case 'budget': return '💰'
      case 'mid': return '⭐'
      case 'premium': return '💎'
      case 'luxury': return '👑'
      default: return '💵'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AI Style Recommendations</h2>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Style Recommendations</h2>
              <p className="text-blue-100">Personalized design suggestions powered by machine learning</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-white">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Trending</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">95% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((style) => (
            <div
              key={style.id}
              className={clsx(
                "group relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl cursor-pointer",
                selectedStyle === style.id 
                  ? "border-blue-500 shadow-lg scale-105" 
                  : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => setSelectedStyle(style.id)}
            >
              {/* Trending Badge */}
              {style.trending && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Trending</span>
                  </div>
                </div>
              )}

              {/* Color Palette Preview */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{style.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-600">{style.confidence}%</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{style.description}</p>

                {/* Color Scheme */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Palette className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500">Color Palette</span>
                  </div>
                  <div className="flex space-x-1">
                    {style.colorScheme.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Key Elements */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500">Key Furniture</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {style.furniture.slice(0, 2).map((item, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {item}
                      </span>
                    ))}
                    {style.furniture.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{style.furniture.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Mood & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-semibold text-gray-600">{style.mood}</span>
                  </div>
                  <div className={clsx(
                    "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold text-white",
                    getPriceRangeColor(style.priceRange)
                  )}>
                    <span>{getPriceRangeIcon(style.priceRange)}</span>
                    <span className="capitalize">{style.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Selected Style Details */}
        {selectedStyle && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            {(() => {
              const style = recommendations.find(s => s.id === selectedStyle)
              if (!style) return null

              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{style.name} Style Guide</h3>
                    <button
                      onClick={() => setSelectedStyle(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Furniture Recommendations */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Home className="h-5 w-5 text-blue-500" />
                        <span>Recommended Furniture</span>
                      </h4>
                      <div className="space-y-2">
                        {style.furniture.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accessories */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-purple-500" />
                        <span>Accessories & Decor</span>
                      </h4>
                      <div className="space-y-2">
                        {style.accessories.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-3">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                      Apply This Style
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                      Save to Favorites
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                      Share Style
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
