import { useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'

// Scales relative to --tile-fs, which the stylesheet raises on mobile.
function adaptiveStyle(text, isLaneTile) {
  const len = text.length
  const size = factor => `calc(var(--tile-fs) * ${factor})`
  const pad = x => (isLaneTile ? undefined : `14px ${x}px`)
  if (len <= 5) return { fontSize: size(1) }
  if (len <= 6) return { fontSize: size(0.88), letterSpacing: '0.3px' }
  if (len <= 7) return { fontSize: size(0.8), letterSpacing: '0.1px', padding: pad(6) }
  if (len <= 8) return { fontSize: size(0.76), letterSpacing: '0px', padding: pad(4) }
  if (len <= 9) return { fontSize: size(0.72), letterSpacing: '0px', padding: pad(4) }
  return { fontSize: size(0.62), letterSpacing: '-0.2px', padding: pad(2) }
}

export default function Tile({ tile, className = 'tile', disabled = false, onDoubleClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tile.id,
    disabled,
  })

  const isLaneTile = className.includes('lane-tile')
  const tileStyle = useMemo(
    () => adaptiveStyle(tile.text, isLaneTile),
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
