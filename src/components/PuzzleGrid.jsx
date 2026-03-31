import { useDroppable } from '@dnd-kit/core'
import Tile from './Tile'

export default function PuzzleGrid({ tiles, isDragOver }) {
  const { setNodeRef } = useDroppable({ id: 'puzzle-grid-droppable' })

  const isEmpty = tiles.length === 0

  return (
    <div
      ref={setNodeRef}
      className={`puzzle-grid${isDragOver ? ' drag-over' : ''}${isEmpty ? ' empty' : ''}`}
    >
      {isEmpty ? (
        <span className="empty-message">All tiles assigned to swim lanes</span>
      ) : (
        tiles.map(tile => <Tile key={tile.id} tile={tile} />)
      )}
    </div>
  )
}
