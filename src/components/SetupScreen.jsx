import { useState } from 'react'

function getPuzzleUrl() {
  const today = new Date().toISOString().slice(0, 10)
  // In dev, use Vite proxy. In production, fetch directly from NYT.
  if (import.meta.env.DEV) {
    return '/api/puzzle'
  }
  return `https://www.nytimes.com/svc/connections/v2/${today}.json`
}

export default function SetupScreen({ onStart }) {
  const [mode, setMode] = useState('manual')
  const [words, setWords] = useState(Array(16).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateWord = (index, value) => {
    setWords(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text')
    // If pasting multiple words (comma or newline separated), fill inputs
    const parts = pasted.split(/[,\n\r]+/).map(s => s.trim()).filter(Boolean)
    if (parts.length > 1) {
      e.preventDefault()
      const target = e.target
      const inputs = target.parentElement.querySelectorAll('input')
      const startIdx = Array.from(inputs).indexOf(target)
      setWords(prev => {
        const next = [...prev]
        parts.forEach((p, i) => {
          if (startIdx + i < 16) next[startIdx + i] = p
        })
        return next
      })
    }
  }

  const filledWords = words.filter(w => w.trim())
  const canStart = filledWords.length === 16

  const handleStart = () => {
    if (canStart) {
      onStart(words.map(w => w.trim().toUpperCase()))
    }
  }

  const fetchPuzzle = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(getPuzzleUrl())
      if (!res.ok) throw new Error(`Failed to fetch puzzle (${res.status})`)
      const data = await res.json()

      // The NYT connections API returns categories with cards
      let puzzleWords = []
      if (data.categories) {
        for (const cat of data.categories) {
          for (const card of cat.cards) {
            puzzleWords.push(card.content)
          }
        }
      } else if (data.words) {
        puzzleWords = data.words
      }

      if (puzzleWords.length !== 16) {
        throw new Error(`Expected 16 words, got ${puzzleWords.length}`)
      }

      // Shuffle the words like the real puzzle does
      const shuffled = [...puzzleWords].sort(() => Math.random() - 0.5)
      onStart(shuffled.map(w => w.toUpperCase()))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="setup">
      <div className="setup-tabs">
        <button
          className={mode === 'manual' ? 'active' : ''}
          onClick={() => setMode('manual')}
        >
          Enter Words
        </button>
        <button
          className={mode === 'fetch' ? 'active' : ''}
          onClick={() => setMode('fetch')}
        >
          Today&apos;s Puzzle
        </button>
      </div>

      {mode === 'manual' ? (
        <div className="manual-input">
          <div className="word-inputs">
            {words.map((word, i) => (
              <input
                key={i}
                type="text"
                value={word}
                onChange={(e) => updateWord(i, e.target.value)}
                onPaste={handlePaste}
                placeholder={`${i + 1}`}
              />
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="info-msg" style={{ marginBottom: 12 }}>
              {filledWords.length}/16 words entered. Tip: paste a comma-separated list.
            </p>
            <button className="btn" disabled={!canStart} onClick={handleStart}>
              Start Sorting
            </button>
          </div>
        </div>
      ) : (
        <div className="fetch-section">
          <p>
            Fetch today&apos;s puzzle words from the NYT Connections API.
          </p>
          {loading ? (
            <div className="fetch-loading">
              <div className="spinner" />
              Fetching today&apos;s puzzle...
            </div>
          ) : (
            <button className="btn" onClick={fetchPuzzle}>
              Fetch Today&apos;s Words
            </button>
          )}
          {error && <p className="error-msg">{error}</p>}
        </div>
      )}
    </div>
  )
}
