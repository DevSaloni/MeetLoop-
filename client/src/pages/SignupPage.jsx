import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../components/Logo'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Navigate to dashboard (mock auth)
    navigate('/app')
  }

  return (
    <div className="bg-[#09090B] text-on-surface min-h-screen flex items-center justify-center p-6 selection:bg-primary-container selection:text-white relative overflow-hidden">
      {/* Visual Accents (Subtle Glows) */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-container/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Signup Container */}
      <main className="w-full max-w-[480px] bg-[#111113] border border-white/5 rounded-lg p-8 shadow-2xl animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-6">
          <Logo className="mb-4 scale-110" />
          <h1 className="text-2xl text-on-surface mb-1 tracking-tight" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Create an account</h1>
          <p className="text-sm text-on-surface-variant font-medium">Join the loop and stay accountable</p>
        </div>
        {/* Form Section */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="name" style={{ fontFamily: 'Inter' }}>Full Name</label>
            <input
              className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg px-4 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-on-surface-variant/40"
              id="name"
              name="name"
              placeholder="Alex Rivera"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="email" style={{ fontFamily: 'Inter' }}>Work Email</label>
            <input
              className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg px-4 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-on-surface-variant/40"
              id="email"
              name="email"
              placeholder="alex@company.com"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="company" style={{ fontFamily: 'Inter' }}>Company / Team Name</label>
            <input
              className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg px-4 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-on-surface-variant/40"
              id="company"
              name="company"
              placeholder="Growth Lab"
              type="text"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="password" style={{ fontFamily: 'Inter' }}>Password</label>
            <input
              className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg px-4 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-on-surface-variant/40"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Primary Action */}
          <button
            className="w-full h-12 bg-primary-container text-on-secondary font-semibold text-base rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 shadow-lg"
            type="submit"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Create Account
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5"></span>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#111113] px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" style={{ fontFamily: 'Inter' }}>or</span>
          </div>
        </div>

        {/* Social Login */}
        <button className="w-full h-12 bg-transparent border border-white/10 rounded-lg text-on-surface font-medium hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-4">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Join Now
        </button>

        {/* Terms Footer */}
        <div className="mt-8 text-center px-4">
          <p className="text-[10px] leading-relaxed text-on-surface-variant uppercase tracking-widest opacity-60">
            By signing up, you agree to our{' '}
            <a className="text-on-surface underline hover:text-primary transition-colors cursor-pointer">Terms of Service</a>{' '}
            and{' '}
            <a className="text-on-surface underline hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Already have an account?
            <Link to="/login" className="text-primary-container font-semibold hover:underline decoration-primary-container/40 underline-offset-4 ml-2">Sign in →</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
