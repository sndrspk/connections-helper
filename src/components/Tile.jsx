import { useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'

function adaptiveStyle(text, basePx) {
  const len = text.length
  if (len <= 5) return { fontSize: `${basePx}px` }
  if (len <= 6) return { fontSize: `${basePx - 2}px`, letterSpacing: '0.3px' }
  if (len <= 8) return { fontSize: `${basePx - 3}px`, letterSpacing: '0.1px', padding: '14px 6px' }
  return { fontSize: `${basePx - 4}px`, letterSpacing: '0px', padding: '14px 4px' }
}

export default function Tile({ tile, className = 'tile', disabled = false, onDoubleClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tile.id,
    disabled,
  })

  const isLaneTile = className.includes('lane-tile')
  const tileStyle = useMemo(
    () => adaptiveStyle(tile.text, isLaneTile ? 13 : 14),
    [tile.text, isLaneTile]
  )

  return (
    <div
      ref={setNodeRef}
      className={`${className}${isDragging ? ' dragging' : ''}`}
      style={tileStyle}
      {...(disabled ? {} : listeners)}
      {...attributes}
      onDoubleClick={onDoubleClick ? () => onDoubleClick(tile.id) : undefined}
    >
      {tile.text}
    </div>
  )
}
