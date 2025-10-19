import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { BarChart3, Search, Moon, Sun, Palette, Sparkles, Heart, Share2, Settings } from 'lucide-react'
import Recommend from './pages/Recommend'
import Analytics from './pages/Analytics'
import ConnectionStatus from './components/ConnectionStatus'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'

function App() {
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  // Theme colors for creative customization
  const themes = [
    { name: 'Ocean', primary: 'blue', secondary: 'cyan', accent: 'teal' },
    { name: 'Forest', primary: 'green', secondary: 'emerald', accent: 'lime' },
    { name: 'Sunset', primary: 'orange', secondary: 'red', accent: 'pink' },
    { name: 'Royal', primary: 'purple', secondary: 'violet', accent: 'indigo' },
    { name: 'Minimal', primary: 'gray', secondary: 'slate', accent: 'zinc' },
  ]

  const [selectedTheme, setSelectedTheme] = useState(themes[0])

  // Apply theme classes
  useEffect(() => {
    const root = document.documentElement
    root.className = isDarkMode ? 'dark' : ''
    
    // Apply custom theme colors
    root.style.setProperty('--primary-color', `var(--${selectedTheme.primary}-600)`)
    root.style.setProperty('--secondary-color', `var(--${selectedTheme.secondary}-500)`)
    root.style.setProperty('--accent-color', `var(--${selectedTheme.accent}-400)`)
  }, [isDarkMode, selectedTheme])

  const navigation = [
    { name: 'Discover', href: '/recommend', icon: Search, description: 'Smart furniture recommendations' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Data insights & trends' },
  ]

  return (
    <div className={clsx(
      "min-h-screen transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    )}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className={clsx(
        "relative z-10 backdrop-blur-md border-b transition-all duration-300",
        isDarkMode 
          ? "bg-gray-900/80 border-gray-700 shadow-lg shadow-gray-900/20" 
          : "bg-white/80 border-gray-200 shadow-lg shadow-blue-100/20"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  AI Furniture Studio
                </h1>
                <p className="text-xs text-gray-500">Powered by AI</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      "group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Theme Controls */}
            <div className="flex items-center space-x-3">
              {/* Theme Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Theme Selector"
                >
                  <Palette className="h-4 w-4 text-gray-600" />
                </button>
                
                {showThemeSelector && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => {
                          setSelectedTheme(theme)
                          setShowThemeSelector(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <div className={clsx(
                          "w-3 h-3 rounded-full",
                          `bg-${theme.primary}-500`
                        )}></div>
                        <span>{theme.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600" />
                )}
              </button>

              {/* Connection Status */}
              <ConnectionStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Recommend />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className={clsx(
        "relative z-10 mt-16 border-t transition-all duration-300",
        isDarkMode 
          ? "bg-gray-900/80 border-gray-700" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold gradient-text">Furniture Studio</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Discover your perfect furniture with intelligent recommendations and data-driven insights.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Icon className="h-3 w-3" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Social Actions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Actions</h4>
              <div className="flex space-x-3">
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; 2024 Furniture Studio. Made with ❤️ by Chinmay Solanki.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App