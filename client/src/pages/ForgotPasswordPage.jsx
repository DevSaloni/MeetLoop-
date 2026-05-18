import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { baseUrl } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    setLoading(true)
    const loadId = toast.loading('Sending reset link...')

    try {
      await axios.post(`${baseUrl}/auth/forgotpassword`, { email });
      toast.success('Reset link sent to your email!', { id: loadId, duration: 6000 })
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link', { id: loadId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <main className="w-full max-w-[440px] glass-card rounded-lg p-8 shadow-2xl animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Logo className="mb-4 scale-90" />
          <h1 className="text-2xl text-on-surface mb-1 tracking-tight" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Reset Password</h1>
          <p className="text-sm text-on-surface-variant text-center">
            {sent
              ? "If an account exists, a reset link has been sent to your email."
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
        </div>

        {!sent ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
                <input
                  className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg pl-16 pr-6 text-base text-on-surface focus:border-primary-container transition-all outline-none"
                  placeholder="e.g. saloni@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className={`w-full h-12 bg-primary-container text-white font-semibold text-base rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 ${loading ? 'opacity-70 pointer-events-none' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
              {!loading && <span className="material-symbols-outlined text-lg">send</span>}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-emerald-500 text-3xl">mail</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl text-on-surface font-semibold">Check your email</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We've sent a password reset link to <b>{email}</b>. Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>

            <Link to="/login" className="btn-secondary-premium block w-full h-12 text-white font-semibold rounded-lg flex items-center justify-center transition-all">
              Back to Login
            </Link>
          </div>
        )}

        {!sent && (
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link to="/login" className="text-sm text-on-surface-variant hover:text-primary-container transition-colors">
              Remembered your password? <span className="font-semibold underline underline-offset-4 ml-1">Sign In</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
