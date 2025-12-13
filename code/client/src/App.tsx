import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import DashboardPage from './pages/DashboardPage.tsx'
import BrowseLeaguesPage from './pages/BrowseLeaguesPage.tsx'
import LeagueList from './pages/LeagueList.tsx'
import LeaguePage from './pages/LeaguePage.tsx'
import LeagueNightPage from './pages/LeagueNightPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import ContactPage from './pages/ContactPage.tsx'
import PrivacyPage from './pages/PrivacyPage.tsx'
import TermsPage from './pages/TermsPage.tsx'
import LeaderboardPage from './pages/LeaderboardPage.tsx'
import { AuthPage } from './pages/AuthPage'
import './App.css'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
        <Routes>
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <DashboardPage /> : <LeagueList />}
          />
          <Route
            path="/leagues"
            element={isAuthenticated ? <BrowseLeaguesPage /> : <LeagueList />}
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
            path="/profile/:username"
            element={<ProfilePage />}
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
          <Route
            path="/contact"
            element={<ContactPage />}
          />
          <Route
            path="/privacy"
            element={<PrivacyPage />}
          />
          <Route
            path="/terms"
            element={<TermsPage />}
          />
          <Route
            path="/leaderboard"
            element={<LeaderboardPage />}
          />
        </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

