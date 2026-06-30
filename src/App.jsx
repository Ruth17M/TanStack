import { useState } from 'react'
import EmployeeTableFrontendExample from '../src/components/EmployeeTableFrontendExample'
import EmployeeTableBackendExample from '../src/components/EmployeeTableBackendExample'
import './App.css'

function App() {

  const [mode, setMode] = useState('frontend')
  
  return (
     <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setMode('frontend')} disabled={mode === 'frontend'}>
          Modo frontend
        </button>
        <button onClick={() => setMode('backend')} disabled={mode === 'backend'}>
          Modo backend
        </button>
      </div>

      {mode === 'frontend'
        ? <EmployeeTableFrontendExample />
        : <EmployeeTableBackendExample />}
    </div>
  )
}

export default App
