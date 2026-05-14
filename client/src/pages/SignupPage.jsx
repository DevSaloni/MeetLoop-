import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import CustomSelect from '../components/ui/CustomSelect'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Contributor' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { user, setUser, baseUrl } = useAuth()

  const queryParams = new URLSearchParams(window.location.search);
  const inviteCode = queryParams.get('invite');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (inviteCode) {
        navigate(`/app/teams?invite=${inviteCode}`);
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, inviteCode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRoleChange = (role) => {
    setForm({ ...form, role })
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) return toast.error('Full name is required');
    if (!form.email) return toast.error('Email is required');
    if (!validateEmail(form.email)) return toast.error('Invalid email format');
    if (!form.password) return toast.error('Password is required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!['Contributor', 'Team Lead'].includes(form.role)) return toast.error('Invalid role selected');

    setLoading(true)
    const loadId = toast.loading('Creating account...')

    try {
      const payload = { ...form };
      if (inviteCode) payload.inviteCode = inviteCode;

      const { data } = await axios.post(`${baseUrl}/auth/register`, payload);

      if (inviteCode) {
        // Auto-login the user ONLY in the invite flow
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        toast.success('Account created successfully!', { id: loadId, duration: 5000 })
        navigate(`/app/teams?invite=${inviteCode}`)
      } else {
        // Normal flow: require manual login
        toast.success('Account created! Please sign in.', { id: loadId, duration: 5000 })
        navigate('/login')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed'
      const shortMsg = msg.length > 40 ? 'Account creation failed' : msg;
      toast.error(shortMsg, { id: loadId, duration: 4000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#09090B] text-on-surface min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-y-auto">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-container/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <main className="w-full max-w-[480px] bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in relative z-10 my-8">
        <div className="flex flex-col items-center mb-6">
          <Logo className="mb-4 scale-110" />
          <h1 className="text-2xl text-on-surface mb-1 tracking-tight" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Create an account</h1>
          <p className="text-sm text-on-surface-variant font-medium">Join the loop and stay accountable</p>
        </div>

        {inviteCode && (
          <div className="mb-6 p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">group_add</span>
            <div className="text-sm">
              <span className="text-white font-semibold block">You have a team invite!</span>
              <span className="text-on-surface-variant text-xs">Sign up below to automatically join.</span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="name">Full Name</label>
            <input
              className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg px-4 text-base text-on-surface focus:border-primary-container transition-all outline-none"
              id="name"
              name="name"
              placeholder="e.g. Saloni Pawar"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="email">Work Email</label>
            <input
              className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg px-4 text-base text-on-surface focus:border-primary-container transition-all outline-none"
              id="email"
              name="email"
              placeholder="e.g. saloni@gmail.com"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {!inviteCode && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Your Role</label>
              <CustomSelect
                options={['Contributor', 'Team Lead']}
                value={form.role}
                onChange={handleRoleChange}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest" htmlFor="password">Password</label>
            <div className="relative">
              <input
                className="w-full h-12 bg-[#09090B] border border-white/10 rounded-lg px-4 pr-12 text-base text-on-surface focus:border-primary-container transition-all outline-none"
                id="password"
                name="password"
                placeholder="Min. 6 characters"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
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
            className={`w-full h-12 bg-primary-container text-white font-semibold text-base rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 shadow-lg ${loading ? 'opacity-70 pointer-events-none' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Already have an account?
            <Link to={inviteCode ? `/login?invite=${inviteCode}` : "/login"} className="text-primary-container font-semibold hover:underline underline-offset-4 ml-2">Sign in →</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
