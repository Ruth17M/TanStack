import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import EmployeeTable from '../src/components/EmployeeTable'

function App() {

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <p className="app-tagline">Panel de gestión </p>
        </div>
      </header>

      <main className="app-main">
        <EmployeeTable />
      </main>

    </div>
  )
}

export default App
