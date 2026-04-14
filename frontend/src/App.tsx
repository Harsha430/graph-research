import Header from './components/Header'
import SearchBar from './components/SearchBar'
import WorkflowTracker from './components/WorkflowTracker'
import SearchMonitor from './components/SearchMonitor'
import TelemetryConsole from './components/TelemetryConsole'
import ReportPanel from './components/ReportPanel'
import { useResearchAgent } from './hooks/useResearchAgent'

export default function App() {
  const {
    state,
    mockMode,
    startResearch,
    stopResearch,
    resetResearch,
    toggleMockMode,
  } = useResearchAgent()

  return (
    <div className="app-shell">
      <Header
        status={state.status}
        mockMode={mockMode}
        totalTokens={state.total_tokens}
        onToggleMock={toggleMockMode}
      />

      <SearchBar
        status={state.status}
        onStart={startResearch}
        onStop={stopResearch}
      />

      <div className="main-grid">
        <aside className="left-panel">
          <WorkflowTracker
            stepStatuses={state.stepStatuses}
            retryCount={state.retryCount}
          />
          <SearchMonitor
            subQuestions={state.subQuestions}
            completedQuestions={state.completedQuestions}
            status={state.status}
          />
          <TelemetryConsole
            logs={state.logs}
            status={state.status}
          />
        </aside>

        <ReportPanel
          status={state.status}
          topic={state.topic}
          report={state.finalReport}
          wordCount={state.wordCount}
          onReset={resetResearch}
        />
      </div>
    </div>
  )
}
