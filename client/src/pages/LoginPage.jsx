import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, setUser, baseUrl } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Professional Validation
    if (!email) return toast.error('Email is required');
    if (!validateEmail(email)) return toast.error('Invalid email format');
    if (!password) return toast.error('Password is required');

    setLoading(true)
    const loadId = toast.loading('Signing in...')

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
      setUser(response.data);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      toast.success('Welcome back!', { id: loadId, duration: 4000 })
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      // Keep error message short and professional
      const shortMsg = msg.length > 40 ? 'Incorrect email or password' : msg;
      toast.error(shortMsg, { id: loadId, duration: 4000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-container/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <main className="w-full max-w-[440px] glass-card rounded-lg p-8 shadow-2xl animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Logo className="mb-4 scale-90" />
          <h1 className="text-2xl text-on-surface mb-1 tracking-tight" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Welcome back</h1>
          <p className="text-sm text-on-surface-variant">Sign in to your workspace</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="login-email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
              <input
                className="w-full h-12 input-inset rounded-lg pl-16 pr-6 text-base text-on-surface focus:border-primary-container transition-all"
                id="login-email"
                placeholder="e.g. saloni@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="login-password">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-on-surface-variant hover:text-primary-container transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
              <input
                className="w-full h-12 input-inset rounded-lg pl-16 pr-12 text-base text-on-surface focus:border-primary-container transition-all"
                id="login-password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            className={`w-full h-12 bg-primary-container text-white font-semibold text-base rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 ${loading ? 'opacity-70 pointer-events-none' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-on-surface-variant">
            Don't have an account?
            <Link to="/signup" className="text-primary-container font-semibold hover:underline underline-offset-4 ml-2">Join now →</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
