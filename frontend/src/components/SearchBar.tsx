import { useState, useRef } from 'react'
import { AppStatus } from '../types/agent'

interface SearchBarProps {
  status: AppStatus
  onStart: (topic: string) => void
  onStop: () => void
}

export default function SearchBar({ status, onStart, onStop }: SearchBarProps) {
  const [input, setInput] = useState('')
  const [flash, setFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isRunning = status === 'researching'

  const handleAction = () => {
    if (isRunning) {
      onStop()
      return
    }
    if (!input.trim()) {
      setFlash(true)
      inputRef.current?.focus()
      setTimeout(() => setFlash(false), 600)
      return
    }
    onStart(input.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAction()
  }

  return (
    <div className="search-zone">
      <div className="search-container">
        <input
          ref={inputRef}
          type="text"
          className={`search-input ${flash ? 'search-input-flash' : ''}`}
          placeholder="Enter a research topic..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
        />
        <button
          className={`search-btn ${isRunning ? 'search-btn-stop' : 'search-btn-start'}`}
          onClick={handleAction}
        >
          {isRunning ? 'Stop' : 'Research'}
        </button>
      </div>
    </div>
  )
}
