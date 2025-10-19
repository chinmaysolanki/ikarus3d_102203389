import { useState, useEffect } from 'react'
import { AnalyticsSummary } from '@/lib/types'
import { apiClient, ApiError } from '@/lib/api'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  LineChart,
  Line,
  Scatter,
  ScatterChart,
  ComposedChart,
  ReferenceLine
} from 'recharts'
import { 
  TrendingUp, 
  Package, 
  Tag, 
  DollarSign, 
  Loader2, 
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  Target,
  Zap,
  Heart,
  Star,
  Award,
  Lightbulb,
  Users,
  ShoppingCart,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

// 🎨 **Creative Color Palette Strategy**
// We use a **sophisticated color scheme** that's both professional and engaging:
// - **Primary Blues**: Trust, reliability, technology
// - **Success Greens**: Growth, prosperity, positive trends  
// - **Warning Oranges**: Attention, opportunity, energy
// - **Accent Purples**: Innovation, creativity, premium quality
const COLORS = {
  primary: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'],
  gradients: {
    blue: ['#0ea5e9', '#0284c7'],
    green: ['#10b981', '#059669'],
    purple: ['#8b5cf6', '#7c3aed'],
    orange: ['#f59e0b', '#d97706']
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#0ea5e9'
  }
}

  // 🧠 **Analytics Intelligence Functions**
  // These functions provide **business insights** and **actionable recommendations**
  // based on the data patterns we discover
  
  const getMarketInsights = (data: AnalyticsSummary) => {
    const insights = []
    
    // Price analysis insights
    const avgPrice = data.price_stats?.mean || 0
    const priceRange = (data.price_stats?.max || 0) - (data.price_stats?.min || 0)
    
    if (avgPrice < 100) {
      insights.push({
        icon: <Target className="w-5 h-5 text-blue-500" />,
        title: "Budget-Friendly Market",
        description: "Your catalog focuses on affordable furniture, perfect for first-time buyers and budget-conscious consumers.",
        impact: "high"
      })
    } else if (avgPrice > 500) {
      insights.push({
        icon: <Award className="w-5 h-5 text-purple-500" />,
        title: "Premium Positioning",
        description: "You're positioned in the luxury segment, targeting customers who value quality and design over price.",
        impact: "high"
      })
    }
    
    // Brand concentration insights
    const brandCount = data.total_brands || 0
    const topBrandShare = data.top_brands?.[0]?.count ? (data.top_brands[0].count as number) / data.total_products * 100 : 0
    
    if (topBrandShare > 20) {
      insights.push({
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        title: "Brand Concentration",
        description: `Your top brand represents ${topBrandShare.toFixed(1)}% of products. Consider diversifying to reduce dependency.`,
        impact: "medium"
      })
    }
    
    // Category insights
    const categoryCount = data.total_categories || 0
    if (categoryCount > 20) {
      insights.push({
        icon: <Lightbulb className="w-5 h-5 text-green-500" />,
        title: "Diverse Portfolio",
        description: "You offer a wide variety of furniture categories, appealing to different customer needs and preferences.",
        impact: "high"
      })
    }
    
    return insights
  }
  
  const getRecommendationInsights = (data: AnalyticsSummary) => {
    const recommendations = []
    
    // Price-based recommendations
    const avgPrice = data.price_stats?.mean || 0
    if (avgPrice < 200) {
      recommendations.push({
        icon: <TrendingUp className="w-5 h-5 text-green-500" />,
        title: "Expand Premium Range",
        suggestion: "Consider adding higher-priced items to capture customers willing to pay more for quality.",
        priority: "medium"
      })
    }
    
    // Brand recommendations
    const brandCount = data.total_brands || 0
    if (brandCount < 10) {
      recommendations.push({
        icon: <Package className="w-5 h-5 text-blue-500" />,
        title: "Brand Diversification",
        suggestion: "Adding more brands can reduce risk and appeal to brand-conscious customers.",
        priority: "high"
      })
    }
    
    return recommendations
  }

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getAnalyticsSummary()
      setAnalytics(data)
    } catch (err) {
      console.error('Analytics error:', err)
      
      if (err instanceof ApiError) {
        setError(err.message)
        toast.error(`Failed to load analytics: ${err.message}`)
      } else {
        setError('An unexpected error occurred')
        toast.error('Failed to load analytics')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Insights into your furniture catalog
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card">
              <div className="skeleton h-4 w-20 mb-2"></div>
              <div className="skeleton h-8 w-16"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card">
              <div className="skeleton h-6 w-32 mb-4"></div>
              <div className="skeleton h-64 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Insights into your furniture catalog
          </p>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load analytics
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Loader2 className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Insights into your furniture catalog
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Package className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.total_products)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Brands</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.total_brands)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.total_categories)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.price_stats.mean)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Brands Bar Chart */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top Brands</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.top_brands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="brand" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatNumber(value), 'Products']}
                labelFormatter={(label) => `Brand: ${label}`}
              />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Category Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.top_categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, count }) => `${category} (${count})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.top_categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatNumber(value), 'Products']}
                labelFormatter={(label) => `Category: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Smart Insights */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Market Insights</h2>
          </div>
          <div className="space-y-4">
            {getMarketInsights(analytics).map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                {insight.icon}
                <div>
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    insight.impact === 'high' ? 'bg-green-100 text-green-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {insight.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Statistics */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSign className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Price Statistics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Minimum</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(analytics.price_stats.min)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Maximum</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(analytics.price_stats.max)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Average</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(analytics.price_stats.mean)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-600">Median</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(analytics.price_stats.median)}
              </span>
            </div>
          </div>
        </div>

        {/* Average Price per Category */}
        {analytics.category_avg_prices && analytics.category_avg_prices.length > 0 && (
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <DollarSign className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Average Price per Category</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.category_avg_prices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Average Price']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar dataKey="avg_price" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Demo Mode Notice */}
        {analytics.demo_mode && (
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-yellow-900">Demo Mode</h2>
            </div>
            <p className="text-yellow-800">
              The system is currently running in demo mode with sample data. 
              Upload a CSV file with product data to see real analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
