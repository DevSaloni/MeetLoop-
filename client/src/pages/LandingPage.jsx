import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const features = [
  { icon: 'psychology', title: 'AI Task Extraction', desc: 'Paste transcripts and let Gemini automatically identify decisions, tasks, and owners.' },
  { icon: 'verified', title: 'Commitment Cards', desc: 'The "Digital Handshake" ensures every team member confirms their specific responsibilities.' },
  { icon: 'search', title: 'Global Search', desc: 'Real-time discovery across all your meetings, teams, and tasks from one central bar.' },
  { icon: 'dashboard', title: 'Accountability Hub', desc: 'A dedicated dashboard for contributors to track their promises across every team sync.' },
  { icon: 'groups', title: 'Team Workspaces', desc: 'Create private team vaults and onboard members instantly with secure invite codes.' },
  { icon: 'monitoring', title: 'Reliability Analytics', desc: 'Track team performance with health scores based on real commitment completion data.' },
]

const problems = [
  { icon: 'cloud_off', title: 'Commitments Evaporate', desc: 'Verbal agreements disappear the moment the call ends. MeetLoop pins them to the timeline instantly.' },
  { icon: 'help_outline', title: 'No One Knows Who Owes What', desc: 'Shared responsibility often means no responsibility. Assign tasks to specific owners with explicit confirmation.' },
  { icon: 'visibility_off', title: 'Managers Are Blind', desc: 'Stop chasing status updates. See a live graph of who is delivering and who is stalling across all projects.' },
]

const steps = [
  { icon: 'content_paste', title: '1. Paste Notes', desc: 'Drop your raw transcript or meeting notes into the loop. No manual cleanup required.' },
  { icon: 'psychology', title: '2. AI Extracts Tasks', desc: 'Our engine identifies decisions and action items. You review and verify the owners.' },
  { icon: 'verified', title: '3. Digital Handshake', desc: 'Contributors confirm their tasks on their dashboard, transforming talk into accountability.' },
]

const testimonials = [
  { name: 'Aditya R.', role: 'CTO @ TechFlow', initials: 'AR', text: '"MeetLoop has completely eliminated the \'who said what\' argument in our standups. It\'s the source of truth for all our commitments."' },
  { name: 'Megha S.', role: 'Head of Product @ Spark', initials: 'MS', text: '"The AI extraction is scarily accurate. It catches things I missed while taking manual notes. Worth every penny."' },
  { name: 'Kiran T.', role: 'Operations Director @ Zenith', initials: 'KT', text: '"Accountability increased by 40% in our first month. The visibility alone changed how our managers approach team meetings."' },
]

const teamPerformance = [
  { name: 'Aditya R. (Lead)', pct: 92 },
  { name: 'Megha S. (Design)', pct: 85 },
  { name: 'Kiran T. (Eng)', pct: 78 },
  { name: 'Sarah L. (Product)', pct: 95 },
]


export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-16">
        {/* Glow Effects */}
        <div className="absolute top-[-120px] left-[10%] lg:left-[20%] w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-orange-500/10 blur-[100px] lg:blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-120px] right-[5%] lg:right-[10%] w-[250px] lg:w-[400px] h-[250px] lg:h-[400px] bg-orange-500/10 blur-[100px] lg:blur-[140px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center">

            {/* LEFT SIDE */}
            <div className="animate-fade-in text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-orange-500/20 bg-orange-500/10 px-4 lg:px-5 py-2 rounded-full mb-6 hover:bg-orange-500/20 transition-colors cursor-default">
                <span className="material-symbols-outlined text-orange-400 text-sm">sync_alt</span>
                <span className="text-orange-400 text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase">AI-Powered Meeting Accountability</span>
              </div>

              {/* HEADING */}
              <h1 className="text-white font-bold leading-[1.1] tracking-tight text-[36px] md:text-[46px] lg:text-[54px] whitespace-nowrap" style={{ fontFamily: "Space Grotesk" }}>
                Meetings End.<br />
                <span className="text-orange-500">Commitments Shouldn't.</span>
              </h1>

              {/* DESCRIPTION */}
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mt-6 lg:mt-8 max-w-[560px] mx-auto lg:mx-0">
                Automatically capture decisions, extract tasks, and track accountability in one unified workspace. Never let a crucial takeaway slip through the cracks again.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 lg:gap-5 mt-10 lg:mt-12">
                {user ? (
                  <>
                    <Link to="/app/new-meeting" className="btn-primary-premium text-white font-bold px-8 py-3.5 rounded-xl text-sm md:text-base flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined">add_circle</span> New Meeting
                    </Link>
                    <Link to="/app" className="btn-secondary-premium text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-3 text-sm md:text-base">
                      <span className="material-symbols-outlined text-orange-500">grid_view</span> Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="btn-primary-premium text-white font-bold px-8 py-4 rounded-xl text-sm md:text-base flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined">rocket_launch</span> Start for Free
                    </Link>
                    <Link to="/how-it-works" className="btn-secondary-premium text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-sm md:text-base">
                      <span className="material-symbols-outlined text-orange-500">play_circle</span> How it Works
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in delay-200">
              <div className="absolute w-[300px] lg:w-[450px] h-[300px] lg:h-[300px] bg-orange-500/10 blur-[80px] lg:blur-[120px] rounded-full"></div>
              <div className="relative border border-white/10 rounded-2xl lg:rounded-3xl bg-white/[0.03] p-1.5 lg:p-2 backdrop-blur-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                <img src="/hero.png" alt="MeetLoop Dashboard" className="w-full max-w-[450px] h-auto max-h-[430px] object-contain rounded-[12px] lg:rounded-[22px] shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 lg:px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-xs font-bold text-orange-500 tracking-[0.3em] uppercase">The Real Problem</span>
            <h2 className="text-3xl md:text-4xl text-on-surface mt-4" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Meetings Are Expensive...</h2>
            <p className="text-base text-on-surface-variant mt-4 max-w-2xl mx-auto leading-relaxed">Average teams waste 31 hours a month in unproductive meetings. MeetLoop ensures every minute pays off in results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((p, idx) => (
              <div key={p.title} className={`glass-card p-8 lg:p-10 rounded-2xl animate-fade-in delay-${(idx + 1) * 100} hover:bg-white/[0.04]`}>
                <div className="bg-primary-container/10 p-4 rounded-xl w-fit mb-8">
                  <span className="material-symbols-outlined text-primary-container text-3xl">{p.icon}</span>
                </div>
                <h3 className="text-xl lg:text-2xl text-on-surface mb-4" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{p.title}</h3>
                <p className="text-sm lg:text-base text-on-surface-variant leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-8 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-16 animate-fade-in">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Designed for High Performance</h2>
              <p className="text-base text-on-surface-variant mt-4 max-w-2xl">The ultimate toolset for teams that value execution over discussion.</p>
            </div>
            <Link to="/features" className="group text-primary-container font-semibold flex items-center gap-2 hover:translate-x-1 transition-all">
              View All Features <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f, idx) => (
              <div key={f.title} className={`glass-card p-8 rounded-2xl flex flex-col gap-5 animate-fade-in delay-${(idx + 1) * 100} hover:scale-[1.03] transition-all`}>
                <div className="text-primary-container mb-2">
                  <span className="material-symbols-outlined text-4xl">{f.icon}</span>
                </div>
                <h4 className="text-xl lg:text-2xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{f.title}</h4>
                <p className="text-sm lg:text-base text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accountability Graph Demo */}
      <section className="py-20 px-6 lg:px-8 bg-surface-container-high overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl text-on-surface mb-6" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>The Accountability Graph</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8">Get a birds-eye view of team performance. Identify bottlenecks before they become blockers and reward your high-output contributors.</p>
              <ul className="space-y-5">
                {['Live progress tracking', 'Individual velocity metrics', 'Team-wide commitment health'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-on-surface font-medium text-lg">
                    <span className="material-symbols-outlined text-primary-container text-2xl">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-8 lg:p-12 animate-fade-in delay-200 shadow-3xl bg-white/[0.02]">
              <div className="flex justify-between items-center mb-10">
                <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.3em]">Team Performance Live</h5>
                <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Active now</span>
              </div>
              <div className="space-y-8">
                {teamPerformance.map((m) => (
                  <div key={m.name} className="space-y-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-on-surface font-medium">{m.name}</span>
                      <span className="text-orange-500 font-bold">{m.pct}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1500 ease-out" style={{ width: `${m.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 lg:px-8 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-on-surface mb-16 animate-fade-in" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Loved by Teams Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={t.name} className={`glass-card p-10 rounded-2xl flex flex-col gap-6 animate-fade-in delay-${(idx + 1) * 100} text-left hover:bg-white/[0.03]`}>
                <div className="text-orange-500 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-base md:text-lg text-on-surface italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center font-bold text-sm text-orange-500 border border-white/10">{t.initials}</div>
                  <div>
                    <div className="text-sm md:text-base text-on-surface font-bold">{t.name}</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-32 pt-32">
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl lg:rounded-[32px] py-8 px-6 lg:px-16 text-center relative overflow-hidden group shadow-3xl">
          <div className="relative z-10 animate-fade-in">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              Ready to Close the Loop?
            </h2>
            <p className="text-white/80 text-sm md:text-lg max-w-[550px] mx-auto mb-8 leading-relaxed">
              Join high-performance teams using MeetLoop to automate their accountability and drive real project results.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5">
              {user ? (
                <>
                  <Link to="/app/new-meeting" className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:translate-y-[-2px] transition-all shadow-xl flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span> New Meeting
                  </Link>
                  <Link to="/app" className="bg-black/20 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black/30 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">grid_view</span> Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:translate-y-[-2px] transition-all shadow-xl flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">rocket_launch</span> Get Started Free
                  </Link>
                  <Link to="/how-it-works" className="bg-black/20 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black/30 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">play_circle</span> How it Works
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Decorative Background Icon */}
          <span className="material-symbols-outlined absolute -bottom-20 -right-20 text-[280px] text-white opacity-[0.07] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none select-none">
            verified
          </span>
        </div>
      </section>

      <Footer />
    </div>
  )
}
