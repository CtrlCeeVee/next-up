import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LeagueList from './pages/LeagueList.tsx'
import LeaguePage from './pages/LeaguePage.tsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LeagueList />} />
        <Route path="/league/:leagueId" element={<LeaguePage />} />
      </Routes>
    </Router>
  )
}

export default App

