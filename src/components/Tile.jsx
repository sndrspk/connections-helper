import { useDraggable } from '@dnd-kit/core'

export default function Tile({ tile, className = 'tile', disabled = false, onDoubleClick }) {
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
      onDoubleClick={onDoubleClick ? () => onDoubleClick(tile.id) : undefined}
    >
      {tile.text}
    </div>
  )
}
