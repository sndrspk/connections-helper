import { useDraggable } from '@dnd-kit/core'

export default function Tile({ tile, className = 'tile', disabled = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tile.id,
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      className={`${className}${isDragging ? ' dragging' : ''}`}
      {...(disabled ? {} : listeners)}
      {...attributes}
    >
      {tile.text}
    </div>
  )
}
