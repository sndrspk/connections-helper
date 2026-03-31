import { useDroppable } from '@dnd-kit/core'
import Tile from './Tile'

export default function SwimLane({ lane, color, isDragOver, onDescriptionChange }) {
  const { setNodeRef } = useDroppable({ id: lane.id })

  return (
    <div
      className={`swim-lane${isDragOver ? ' drag-over' : ''}`}
      style={{ background: color.light }}
    >
      <div className="lane-header">
        <div className="lane-color-dot" style={{ background: color.main }} />
        <input
          className="lane-description"
          type="text"
          placeholder="Describe this category..."
          value={lane.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <div ref={setNodeRef} className="lane-tiles">
        {lane.tiles.map(tile => (
          <Tile key={tile.id} tile={tile} className="lane-tile" />
        ))}
      </div>
    </div>
  )
}
