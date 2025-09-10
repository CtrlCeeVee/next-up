import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LeagueList from './pages/LeagueList.tsx'
import LeaguePage from './pages/LeaguePage.tsx'
import { AuthPage } from './pages/AuthPage'
import './App.css'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} 
        />
        <Route 
          path="/" 
          element={<LeagueList />} 
        />
        <Route 
          path="/league/:leagueId" 
          element={<LeaguePage />} 
        />
      </Routes>
    </Router>
  )
}

export default App

