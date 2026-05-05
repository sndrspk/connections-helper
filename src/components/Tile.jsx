import { useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'

function adaptiveFontSize(text, basePx) {
  const len = text.length
  if (len <= 6) return basePx
  if (len <= 8) return basePx - 1
  if (len <= 10) return basePx - 2
  return basePx - 3
}

export default function Tile({ tile, className = 'tile', disabled = false, onDoubleClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tile.id,
    disabled,
  })

  const isLaneTile = className.includes('lane-tile')
  const fontSize = useMemo(
    () => adaptiveFontSize(tile.text, isLaneTile ? 13 : 14),
    [tile.text, isLaneTile]
  )

  return (
    <div
      ref={setNodeRef}
      className={`${className}${isDragging ? ' dragging' : ''}`}
      style={{ fontSize: `${fontSize}px` }}
      {...(disabled ? {} : listeners)}
      {...attributes}
      onDoubleClick={onDoubleClick ? () => onDoubleClick(tile.id) : undefined}
    >
      {tile.text}
    </div>
  )
}
