import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { token } = useParams()
  const navigate = useNavigate()
  const { baseUrl, setUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirmPassword) return toast.error('Passwords do not match')

    setLoading(true)
    const loadId = toast.loading('Resetting password...')

    try {
      const response = await axios.put(`${baseUrl}/auth/resetpassword/${token}`, { password });
      toast.success('Password reset successfully!', { id: loadId })

      // Auto login after reset
      setUser(response.data.userInfo);
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));

      navigate('/app')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password', { id: loadId })
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
          <h1 className="text-2xl text-on-surface mb-1 tracking-tight" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Create New Password</h1>
          <p className="text-sm text-on-surface-variant text-center">Your new password must be different from previous passwords.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest">New Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
              <input
                className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg pl-16 pr-12 text-base text-on-surface focus:border-primary-container transition-all outline-none"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary-container transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">verified</span>
              <input
                className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg pl-16 pr-6 text-base text-on-surface focus:border-primary-container transition-all outline-none"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className={`w-full h-12 bg-primary-container text-white font-semibold text-base rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 ${loading ? 'opacity-70 pointer-events-none' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
            {!loading && <span className="material-symbols-outlined text-lg">check_circle</span>}
          </button>
        </form>
      </main>
    </div>
  )
}
