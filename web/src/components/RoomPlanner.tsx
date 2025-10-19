import { useState, useRef, useEffect } from 'react'
import { Move, RotateCcw, Save, Download, Upload, Grid3X3, Home, Sofa, Table, Lamp, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'

interface FurnitureItem {
  id: string
  type: 'sofa' | 'chair' | 'table' | 'lamp' | 'bed'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  color: string
  name: string
}

interface RoomPlannerProps {
  onSave?: (layout: FurnitureItem[]) => void
  onLoad?: () => FurnitureItem[]
}

export default function RoomPlanner({ onSave, onLoad }: RoomPlannerProps) {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [tool, setTool] = useState<'select' | 'sofa' | 'chair' | 'table' | 'lamp' | 'bed'>('select')
  const roomRef = useRef<HTMLDivElement>(null)

  const furnitureTypes = [
    { type: 'sofa', icon: Sofa, color: 'bg-blue-500', name: 'Sofa' },
    { type: 'chair', icon: Sofa, color: 'bg-green-500', name: 'Chair' },
    { type: 'table', icon: Table, color: 'bg-yellow-500', name: 'Table' },
    { type: 'lamp', icon: Lamp, color: 'bg-purple-500', name: 'Lamp' },
    { type: 'bed', icon: Home, color: 'bg-red-500', name: 'Bed' },
  ]

  const addFurniture = (type: FurnitureItem['type']) => {
    const newItem: FurnitureItem = {
      id: `item-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'sofa' ? 120 : type === 'table' ? 80 : type === 'bed' ? 100 : 40,
      height: type === 'sofa' ? 60 : type === 'table' ? 80 : type === 'bed' ? 80 : 40,
      rotation: 0,
      color: furnitureTypes.find(f => f.type === type)?.color || 'bg-gray-500',
      name: furnitureTypes.find(f => f.type === type)?.name || 'Item'
    }
    setFurniture([...furniture, newItem])
    setSelectedItem(newItem.id)
  }

  const deleteFurniture = (id: string) => {
    setFurniture(furniture.filter(item => item.id !== id))
    if (selectedItem === id) {
      setSelectedItem(null)
    }
  }

  const rotateFurniture = (id: string) => {
    setFurniture(furniture.map(item => 
      item.id === id 
        ? { ...item, rotation: (item.rotation + 90) % 360 }
        : item
    ))
  }

  const handleMouseDown = (e: React.MouseEvent, item: FurnitureItem) => {
    if (tool !== 'select') return
    
    e.preventDefault()
    setSelectedItem(item.id)
    setIsDragging(true)
    
    const rect = roomRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - item.x,
        y: e.clientY - rect.top - item.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedItem || tool !== 'select') return
    
    const rect = roomRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y
    
    setFurniture(furniture.map(item => 
      item.id === selectedItem 
        ? { ...item, x: Math.max(0, Math.min(newX, rect.width - item.width)), y: Math.max(0, Math.min(newY, rect.height - item.height)) }
        : item
    ))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleRoomClick = (e: React.MouseEvent) => {
    if (tool === 'select') {
      setSelectedItem(null)
      return
    }
    
    const rect = roomRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left - 20
    const y = e.clientY - rect.top - 20
    
    addFurniture(tool as FurnitureItem['type'])
    setFurniture(prev => prev.map(item => 
      item.id === prev[prev.length - 1]?.id 
        ? { ...item, x, y }
        : item
    ))
  }

  const saveLayout = () => {
    if (onSave) {
      onSave(furniture)
    } else {
      localStorage.setItem('room-layout', JSON.stringify(furniture))
    }
  }

  const loadLayout = () => {
    if (onLoad) {
      const loaded = onLoad()
      setFurniture(loaded)
    } else {
      const saved = localStorage.getItem('room-layout')
      if (saved) {
        setFurniture(JSON.parse(saved))
      }
    }
  }

  const exportLayout = () => {
    const dataStr = JSON.stringify(furniture, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'room-layout.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Grid3X3 className="h-6 w-6" />
            <span>Room Planner</span>
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={saveLayout}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={loadLayout}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              onClick={exportLayout}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Tools */}
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => setTool('select')}
            className={clsx(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105",
              tool === 'select' 
                ? "bg-white text-blue-600 shadow-lg" 
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <Move className="h-4 w-4" />
            <span>Select</span>
          </button>
          
          {furnitureTypes.map(({ type, icon: Icon, color, name }) => (
            <button
              key={type}
              onClick={() => setTool(type as any)}
              className={clsx(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105",
                tool === type 
                  ? "bg-white text-blue-600 shadow-lg" 
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Room Canvas */}
      <div className="p-6">
        <div 
          ref={roomRef}
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-96 cursor-crosshair overflow-hidden"
          onClick={handleRoomClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#9CA3AF" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Furniture Items */}
          {furniture.map((item) => {
            const IconComponent = furnitureTypes.find(f => f.type === item.type)?.icon || Home
            
            return (
              <div
                key={item.id}
                className={clsx(
                  "absolute cursor-move transition-all duration-200 hover:scale-105",
                  selectedItem === item.id && "ring-2 ring-blue-500 ring-offset-2"
                )}
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                  transform: `rotate(${item.rotation}deg)`
                }}
                onMouseDown={(e) => handleMouseDown(e, item)}
              >
                <div className={clsx(
                  "w-full h-full rounded-lg shadow-lg flex items-center justify-center text-white font-semibold relative group",
                  item.color
                )}>
                  <IconComponent className="h-8 w-8" />
                  
                  {/* Item Controls */}
                  {selectedItem === item.id && (
                    <div className="absolute -top-8 left-0 flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          rotateFurniture(item.id)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFurniture(item.id)
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {/* Item Label */}
                  <div className="absolute -bottom-6 left-0 text-xs text-gray-600 font-medium whitespace-nowrap">
                    {item.name}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Instructions */}
          {furniture.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Start Planning Your Room</p>
                <p className="text-sm">Select a furniture type and click to place it</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Items: {furniture.length}</span>
            <span>Selected: {selectedItem ? furniture.find(f => f.id === selectedItem)?.name : 'None'}</span>
          </div>
          <div className="text-xs">
            Click to place • Drag to move • Select to edit
          </div>
        </div>
      </div>
    </div>
  )
}
