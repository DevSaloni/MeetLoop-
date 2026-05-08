import { Link } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Navigate to dashboard (mock auth)
    window.location.href = '/app'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Visual Accent Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-container/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <main className="w-full max-w-[440px] glass-card rounded-lg p-8 shadow-2xl animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Logo className="mb-4 scale-90" />
          <h1 className="text-2xl text-on-surface mb-1 tracking-tight" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Welcome back</h1>
          <p className="text-sm text-on-surface-variant">Sign in to your workspace</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="login-email" style={{ fontFamily: 'Inter' }}>Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
              <input
                className="w-full h-12 input-inset rounded-lg pl-16 pr-6 text-base text-on-surface placeholder:text-on-surface-variant/40"
                id="login-email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="login-password" style={{ fontFamily: 'Inter' }}>Password</label>
              <a className="text-xs font-semibold text-primary-container hover:text-primary transition-colors cursor-pointer" style={{ fontFamily: 'Inter' }}>Forgot password?</a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
              <input
                className="w-full h-12 input-inset rounded-lg pl-16 pr-6 text-base text-on-surface placeholder:text-on-surface-variant/40"
                id="login-password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            className="w-full h-12 bg-primary-container text-on-secondary font-semibold text-base rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
            type="submit"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Sign In
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5"></span>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" style={{ fontFamily: 'Inter', background: '#111113' }}>or continue with</span>
          </div>
        </div>

        {/* Google */}
        <button className="w-full h-12 bg-transparent border border-white/10 rounded-lg text-on-surface hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-4">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Google Sign In
        </button>

        <div className="mt-10 text-center">
          <p className="text-sm text-on-surface-variant">
            Don't have an account?
            <Link to="/signup" className="text-primary-container font-semibold hover:underline decoration-primary-container/40 underline-offset-4 ml-2">Join now →</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
