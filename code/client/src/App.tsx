import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import LeagueList from './pages/LeagueList.tsx'
import LeaguePage from './pages/LeaguePage.tsx'
import LeagueNightPage from './pages/LeagueNightPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import { AuthPage } from './pages/AuthPage'
import './App.css'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <ThemeProvider>
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
          <Route
            path="/league/:leagueId/night/:nightId"
            element={<LeagueNightPage />}
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
          <Route
            path="/profile/:userId"
            element={<ProfilePage />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

