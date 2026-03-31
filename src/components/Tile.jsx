import { useDraggable } from '@dnd-kit/core'

export default function Tile({ tile, className = 'tile' }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tile.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`${className}${isDragging ? ' dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      {tile.text}
    </div>
  )
}
