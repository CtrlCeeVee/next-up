import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import LeagueList from './pages/LeagueList.tsx'
import AboutPage from './pages/AboutPage.tsx'
import ContactPage from './pages/ContactPage.tsx'
import PrivacyPage from './pages/PrivacyPage.tsx'
import TermsPage from './pages/TermsPage.tsx'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DownloadAppPage } from './components/AppDownload'
import './App.css'

// All interactive functionality has moved to the native apps. The website is
// now a marketing surface: the landing/league showcase and legal pages remain,
// and every interactive route (login, leagues, profile, leaderboard) sends the
// user to the app download page instead.
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
        <Routes>
          {/* Marketing landing + league showcase */}
          <Route path="/" element={<LeagueList />} />
          <Route path="/leagues" element={<LeagueList />} />

          {/* Interactive paths -> push the apps */}
          <Route path="/auth" element={<DownloadAppPage />} />
          <Route path="/league/:leagueId" element={<DownloadAppPage />} />
          <Route path="/league/:leagueId/night/:nightId" element={<DownloadAppPage />} />
          <Route path="/profile" element={<DownloadAppPage />} />
          <Route path="/profile/:username" element={<DownloadAppPage />} />
          <Route path="/leaderboard" element={<DownloadAppPage />} />

          {/* Password reset still resolves a real flow (verify whether the
              app's reset emails point here before removing it). */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Legal / compliance pages stay web-accessible (store requirement) */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
