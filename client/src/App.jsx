import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import HowItWorksPage from './pages/HowItWorksPage'
import FeaturesPage from './pages/FeaturesPage'
import ForTeamsPage from './pages/ForTeamsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import MeetingsPage from './pages/MeetingsPage'
import CommitmentsPage from './pages/CommitmentsPage'
import NewMeetingPage from './pages/NewMeetingPage'
import TeamAccountabilityPage from './pages/TeamAccountabilityPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import MeetingDetailsPage from './pages/MeetingDetailsPage'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 6000,
          style: {
            background: '#111113',
            color: '#e5e1e4',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            duration: 6000,
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/for-teams" element={<ForTeamsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* App Routes (with sidebar layout) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="meetings/:id" element={<MeetingDetailsPage />} />
            <Route path="new-meeting" element={<NewMeetingPage />} />
            <Route path="commitments" element={<CommitmentsPage />} />
            <Route path="teams" element={<TeamAccountabilityPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
