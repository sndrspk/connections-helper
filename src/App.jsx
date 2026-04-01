import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import PuzzleGrid from './components/PuzzleGrid'
import SwimLane from './components/SwimLane'
import SetupScreen from './components/SetupScreen'
import { loadState, saveState } from './storage'
import './App.css'

const LANE_COLORS = [
  { main: 'var(--lane-1)', light: 'var(--lane-1-light)' },
  { main: 'var(--lane-2)', light: 'var(--lane-2-light)' },
  { main: 'var(--lane-3)', light: 'var(--lane-3-light)' },
  { main: 'var(--lane-4)', light: 'var(--lane-4-light)' },
]

function createInitialLanes() {
  return [
    { id: 'lane-0', description: '', tiles: [] },
    { id: 'lane-1', description: '', tiles: [] },
    { id: 'lane-2', description: '', tiles: [] },
    { id: 'lane-3', description: '', tiles: [] },
  ]
}

function App() {
  const [puzzleStarted, setPuzzleStarted] = useState(false)
  const [gridTiles, setGridTiles] = useState([])
  const [lanes, setLanes] = useState(createInitialLanes)
  const [activeTile, setActiveTile] = useState(null)
  const [dragOverTarget, setDragOverTarget] = useState(null)

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setPuzzleStarted(true)
      setGridTiles(saved.gridTiles)
      setLanes(saved.lanes)
    }
  }, [])

  // Save state when it changes
  useEffect(() => {
    if (puzzleStarted) {
      saveState({ gridTiles, lanes })
    }
  }, [puzzleStarted, gridTiles, lanes])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const startPuzzle = useCallback((words) => {
    const tiles = words.map((w, i) => ({ id: `tile-${i}`, text: w }))
    setGridTiles(tiles)
    setLanes(createInitialLanes())
    setPuzzleStarted(true)
  }, [])

  const resetPuzzle = useCallback(() => {
    setPuzzleStarted(false)
    setGridTiles([])
    setLanes(createInitialLanes())
    saveState(null)
  }, [])

  const findTileLocation = useCallback((tileId) => {
    if (gridTiles.find(t => t.id === tileId)) return { container: 'grid' }
    for (const lane of lanes) {
      if (lane.tiles.find(t => t.id === tileId)) return { container: lane.id }
    }
    return null
  }, [gridTiles, lanes])

  const handleDragStart = useCallback((event) => {
    const { active } = event
    // Find the tile data
    let tile = gridTiles.find(t => t.id === active.id)
    if (!tile) {
      for (const lane of lanes) {
        tile = lane.tiles.find(t => t.id === active.id)
        if (tile) break
      }
    }
    setActiveTile(tile || null)
  }, [gridTiles, lanes])

  const handleDragOver = useCallback((event) => {
    setDragOverTarget(event.over?.id || null)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    setActiveTile(null)
    setDragOverTarget(null)

    if (!over) return

    const tileId = active.id
    const source = findTileLocation(tileId)
    if (!source) return

    const overId = over.id
    let targetContainer = null

    // Determine the drop target container
    if (overId === 'grid' || overId === 'puzzle-grid-droppable') {
      targetContainer = 'grid'
    } else if (overId.startsWith('lane-')) {
      targetContainer = overId
    } else {
      // Dropped on a tile - find which container that tile is in
      const overLocation = findTileLocation(overId)
      if (overLocation) {
        targetContainer = overLocation.container
      }
    }

    if (!targetContainer || source.container === targetContainer) return

    // Get the tile data
    let tileData
    if (source.container === 'grid') {
      tileData = gridTiles.find(t => t.id === tileId)
    } else {
      const sourceLane = lanes.find(l => l.id === source.container)
      tileData = sourceLane?.tiles.find(t => t.id === tileId)
    }
    if (!tileData) return

    // Remove from source
    if (source.container === 'grid') {
      setGridTiles(prev => prev.filter(t => t.id !== tileId))
    } else {
      setLanes(prev => prev.map(l =>
        l.id === source.container
          ? { ...l, tiles: l.tiles.filter(t => t.id !== tileId) }
          : l
      ))
    }

    // Add to target
    if (targetContainer === 'grid') {
      setGridTiles(prev => [...prev, tileData])
    } else {
      setLanes(prev => prev.map(l =>
        l.id === targetContainer
          ? { ...l, tiles: [...l.tiles, tileData] }
          : l
      ))
    }
  }, [findTileLocation, gridTiles, lanes])

  const updateLaneDescription = useCallback((laneId, description) => {
    setLanes(prev => prev.map(l =>
      l.id === laneId ? { ...l, description } : l
    ))
  }, [])

  if (!puzzleStarted) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Connections Helper</h1>
          <p>Use this as a notepad for today's Connections to sort your puzzle words. Drag tiles into swim lanes to group them — try out ideas before filling them into the real puzzle.</p>
        </header>
        <SetupScreen onStart={startPuzzle} />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Connections Helper</h1>
        <p>Use this as a notepad for today's Connections. Drag tiles into swim lanes to try out groupings before filling them into the real puzzle.</p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="puzzle-section">
          <div className="section-label">Puzzle</div>
          <PuzzleGrid
            tiles={gridTiles}
            isDragOver={dragOverTarget === 'puzzle-grid-droppable'}
          />
        </div>

        <div className="divider" />

        <div className="section-label">Swim Lanes</div>
        <div className="swim-lanes">
          {lanes.map((lane, index) => (
            <SwimLane
              key={lane.id}
              lane={lane}
              color={LANE_COLORS[index]}
              isDragOver={dragOverTarget === lane.id}
              onDescriptionChange={(desc) => updateLaneDescription(lane.id, desc)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTile ? (
            <div className="drag-overlay-tile">{activeTile.text}</div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="toolbar">
        <button className="btn btn-secondary btn-small" onClick={resetPuzzle}>
          New Puzzle
        </button>
      </div>
    </div>
  )
}

export default App
