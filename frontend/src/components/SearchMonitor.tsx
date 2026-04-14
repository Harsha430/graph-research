import { AppStatus } from '../types/agent'

interface SearchMonitorProps {
  subQuestions: string[]
  completedQuestions: string[]
  status: AppStatus
}

export default function SearchMonitor({ subQuestions, completedQuestions, status }: SearchMonitorProps) {
  const isSearching = status === 'researching'

  if (!isSearching && subQuestions.length === 0) return null

  return (
    <div className="section">
      <div className="section-title">Parallel Searches</div>
      <div className="search-monitor">
        {subQuestions.length === 0 ? (
          <div className="monitor-empty">Waiting for planner...</div>
        ) : (
          subQuestions.map((q, idx) => {
            const done = completedQuestions.includes(q)
            return (
              <div key={idx} className="search-item slide-up">
                <span className="search-dot" />
                <span className="search-question">{q}</span>
                <span className="search-status">
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="5" fill="rgba(34,197,94,0.15)" />
                      <path d="M3 5l1.5 1.5 3-3" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="dot dot-pulse" style={{ background: '#38bdf8', width: 6, height: 6 }} />
                  )}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
