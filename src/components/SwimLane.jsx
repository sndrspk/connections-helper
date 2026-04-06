import { useDroppable } from '@dnd-kit/core'
import Tile from './Tile'

export default function SwimLane({ lane, color, isDragOver, onDescriptionChange, onToggleLock, onTileDoubleClick }) {
  const { setNodeRef } = useDroppable({ id: lane.id, disabled: lane.locked })
  const showLock = lane.tiles.length === 4

  return (
    <div
      className={`swim-lane${isDragOver ? ' drag-over' : ''}${lane.locked ? ' locked' : ''}`}
      style={{ background: lane.locked ? '#e8e8e8' : color.light }}
    >
      <div className="lane-header">
        <div
          className="lane-color-dot"
          style={{ background: lane.locked ? '#bbb' : color.main }}
        />
        <input
          className="lane-description"
          type="text"
          placeholder="Describe this category..."
          value={lane.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          readOnly={lane.locked}
          style={lane.locked ? { color: '#999' } : undefined}
        />
        {showLock && (
          <button
            className="lock-btn"
            onClick={onToggleLock}
            title={lane.locked ? 'Unlock lane' : 'Lock lane'}
          >
            {lane.locked ? '🔒' : '🔓'}
          </button>
        )}
      </div>
      <div ref={setNodeRef} className="lane-tiles">
        {lane.tiles.map(tile => (
          <Tile
            key={tile.id}
            tile={tile}
            className={`lane-tile${lane.locked ? ' locked-tile' : ''}`}
            disabled={lane.locked}
            onDoubleClick={lane.locked ? undefined : onTileDoubleClick}
          />
        ))}
      </div>
    </div>
  )
}
