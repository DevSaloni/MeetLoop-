import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const features = [
  { icon: 'smart_toy', title: 'AI Extraction', desc: 'Industry-leading NLP to turn messy speech into structured action items.' },
  { icon: 'account_tree', title: 'Accountability Graph', desc: 'Visualize the network of commitments across your entire organization.' },
  { icon: 'task_alt', title: 'Async Confirmation', desc: 'Team members confirm their tasks after the meeting with a single click.' },
  { icon: 'notifications_active', title: 'Smart Reminders', desc: 'Gentle nudges via Slack or Email before tasks become overdue.' },
  { icon: 'history_edu', title: 'Decision Log', desc: 'A permanent, searchable record of every key decision ever made.' },
  { icon: 'priority_high', title: 'Auto-Escalation', desc: 'Critical tasks that stall are automatically flagged to project leads.' },
]

const problems = [
  { icon: 'cloud_off', title: 'Commitments Evaporate', desc: 'Verbal agreements disappear the moment the call ends. MeetLoop pins them to the timeline instantly.' },
  { icon: 'help_outline', title: 'No One Knows Who Owes What', desc: 'Shared responsibility often means no responsibility. Assign tasks to specific owners before the meeting finishes.' },
  { icon: 'visibility_off', title: 'Managers Are Blind', desc: 'Stop chasing status updates. See a live graph of who is delivering and who is stalling across all projects.' },
]

const steps = [
  { icon: 'content_paste', title: '1. Paste Notes', desc: 'Drop your raw transcript or bullet points into the loop. No cleanup required.' },
  { icon: 'psychology', title: '2. AI Extracts Tasks', desc: 'Our proprietary model identifies decisions, owners, and deadlines in seconds.' },
  { icon: 'verified', title: '3. Track Accountability', desc: 'Tasks are synced to individual dashboards with automated follow-ups.' },
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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black overflow-hidden pt-32 pb-28">
        {/* Glow Effects */}
        <div className="absolute top-[-120px] left-[20%] w-[500px] h-[500px] bg-orange-500/10 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-120px] right-[10%] w-[400px] h-[400px] bg-orange-500/10 blur-[140px] rounded-full"></div>

        <div className="max-w-8xl mx-auto px-8">

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* LEFT SIDE */}
            <div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-orange-500/20 bg-orange-500/10 px-5 py-2 rounded-full mb-8">

                <span className="material-symbols-outlined text-orange-400 text-sm">
                  sync_alt
                </span>

                <span className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase">
                  AI-Powered Meeting Accountability
                </span>

              </div>

              {/* HEADING */}
              <h1
                className="text-white font-bold leading-[1.02] tracking-tight text-[40px] lg:text-[53px]"
                style={{ fontFamily: "Space Grotesk" }}
              >
                Meetings End.
                <br />

                <span className="text-orange-500">
                  Commitments
                </span>{" "}
                Shouldn't.
              </h1>

              {/* DESCRIPTION */}
              <p className="text-gray-400 text-lg leading-8 mt-7 max-w-[560px]">
                Automatically capture decisions, extract tasks, and track
                accountability in one unified workspace. Never let a crucial
                takeaway slip through the cracks again.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-5 mt-12">
                {user ? (
                  <>
                    <Link to="/app/new-meeting" className="btn-primary-premium text-white font-bold px-10 py-5 rounded-2xl text-lg flex items-center gap-3">
                      <span className="material-symbols-outlined">add_circle</span>
                      New Meeting
                    </Link>

                    <Link to="/app" className="btn-secondary-premium text-white px-10 py-5 rounded-2xl flex items-center gap-3 text-lg">
                      <span className="material-symbols-outlined text-orange-500">grid_view</span>
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="btn-primary-premium text-white font-bold px-10 py-5 rounded-2xl text-lg flex items-center gap-3">
                      <span className="material-symbols-outlined">rocket_launch</span>
                      Start for Free
                    </Link>

                    <Link to="/how-it-works" className="btn-secondary-premium text-white px-10 py-5 rounded-2xl flex items-center gap-3 text-lg">
                      <span className="material-symbols-outlined text-orange-500">play_circle</span>
                      How it Works
                    </Link>
                  </>
                )}
              </div>
            </div>


            {/* RIGHT IMAGE */}
            <div className="relative flex justify-end">

              {/* Glow */}
              <div className="absolute w-[450px] h-[450px] bg-orange-500/10 blur-[120px] rounded-full"></div>

              {/* IMAGE CARD */}
              <div className="relative border border-white/10 rounded-3xl bg-white/[0.03] p-2 backdrop-blur-xl shadow-2xl">

                <img
                  src="/hero.png"
                  alt="dashboard"
                  className="w-[620px] h-[420px] object-cover rounded-[22px]"
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary-container tracking-widest uppercase" style={{ fontFamily: 'Inter' }}>The Real Problem</span>
            <h2 className="text-3xl text-on-surface mt-2" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Your Meetings Are Expensive...</h2>
            <p className="text-base text-on-surface-variant mt-4 max-w-2xl mx-auto">Average teams waste 31 hours a month in unproductive meetings. MeetLoop ensures every minute pays off in results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="glass-card p-10 rounded-xl">
                <div className="bg-primary-container/10 p-4 rounded-lg w-fit mb-6">
                  <span className="material-symbols-outlined text-primary-container">{p.icon}</span>
                </div>
                <h3 className="text-2xl text-on-surface mb-4" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{p.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Designed for High Performance</h2>
              <p className="text-base text-on-surface-variant max-w-2xl">The ultimate toolset for teams that value execution over discussion.</p>
            </div>
            <button className="text-primary-container font-semibold flex items-center gap-1 hover:underline transition-all pb-1">
              View All Features <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6 rounded-lg flex flex-col gap-4">
                <span className="material-symbols-outlined text-primary-container text-4xl">{f.icon}</span>
                <h4 className="text-2xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>{f.title}</h4>
                <p className="text-sm text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <h2 className="text-3xl text-on-surface text-center mb-2" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Built for Every Team</h2>
          <div className="flex flex-col gap-4">
            <div className="glass-card p-10 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col gap-1 flex-1 max-w-[500px]">
                <h4 className="text-2xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Product Teams</h4>
                <p className="text-1xl text-on-surface-variant">Bridge the gap between vision and sprint. Ensure every roadmap decision is tracked to completion.</p>
              </div>
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-surface-container bg-surface-bright flex items-center justify-center text-xs font-bold">PT</div>
                <div className="w-10 h-10 rounded-full border-2 border-surface-container bg-primary-container flex items-center justify-center text-xs font-bold text-on-secondary">ML</div>
              </div>
            </div>

            <div className="glass-card p-10 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col gap-1 flex-1 max-w-[500px]">
                <h4 className="text-2xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Agencies</h4>
                <p className="text-1xl text-on-surface-variant">Prove your value to clients with transparent accountability logs and clear project velocity.</p>
              </div>
              <div className="flex items-center gap-2 bg-primary-container/10 px-3 py-1.5 rounded-full border border-primary-container/20">
                <span className="material-symbols-outlined text-primary-container text-sm">groups</span>
                <span className="text-primary-container text-[10px] font-bold uppercase tracking-widest">12 Active Clients</span>
              </div>
            </div>

            <div className="glass-card p-10 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col gap-1 flex-1 max-w-[500px]">
                <h4 className="text-2xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Sales Teams</h4>
                <p className="text-1xl text-on-surface-variant">Never miss a follow-up commitment. Capture prospect requests and turn them into closed deals.</p>
              </div>
              <div className="bg-primary-container/10 text-primary-container px-3 py-1.5 rounded-lg border border-primary-container/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="text-xs font-bold uppercase tracking-widest">+42% Conversion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accountability Graph Demo */}
      <section className="py-16 px-8 bg-surface-container-high">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>The Accountability Graph</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">Get a birds-eye view of team performance. Identify bottlenecks before they become blockers and reward your high-output contributors.</p>
              <ul className="flex flex-col gap-4">
                {['Live progress tracking', 'Individual velocity metrics', 'Team-wide commitment health'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-on-surface font-medium">
                    <span className="material-symbols-outlined text-primary-container">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-xl p-10 flex flex-col gap-6 shadow-2xl">
              <h5 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest" style={{ fontFamily: 'Inter' }}>Team Performance Live</h5>
              <div className="space-y-6">
                {teamPerformance.map((m) => (
                  <div key={m.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface">{m.name}</span>
                      <span className="text-on-surface-variant">{m.pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container transition-all duration-1000" style={{ width: `${m.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-on-surface text-center mb-16" style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Loved by Teams Worldwide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-10 rounded-xl flex flex-col gap-6">
                <div className="text-primary-container flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-base text-on-surface italic leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center font-bold text-sm">{t.initials}</div>
                  <div>
                    <div className="text-sm text-on-surface font-bold">{t.name}</div>
                    <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-8 relative">
        <div className="absolute inset-0 bg-primary-container/5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-6 relative z-10">
          <h2 className="text-5xl text-on-surface" style={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.02em' }}>Stop Letting Commitments Disappear</h2>
          <p className="text-lg text-on-surface-variant">Join 500+ high-performing teams turning meeting talk into measurable progress.</p>
          <div className="flex justify-center gap-5 mt-8">
            {user ? (
              <>
                <Link to="/app/new-meeting" className="btn-primary-premium text-white font-bold px-12 py-5 rounded-2xl text-xl flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
                  <span className="material-symbols-outlined">add_circle</span>
                  New Meeting
                </Link>
                <Link to="/app" className="btn-secondary-premium text-white px-12 py-5 rounded-2xl flex items-center gap-3 text-xl" style={{ fontFamily: 'Space Grotesk' }}>
                  <span className="material-symbols-outlined text-orange-500">grid_view</span>
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn-primary-premium text-white font-bold px-12 py-5 rounded-2xl text-xl flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
                  <span className="material-symbols-outlined">rocket_launch</span>
                  Start for Free
                </Link>
                <Link to="/features" className="btn-secondary-premium text-white px-12 py-5 rounded-2xl flex items-center gap-3 text-xl" style={{ fontFamily: 'Space Grotesk' }}>
                  <span className="material-symbols-outlined text-orange-500">auto_awesome</span>
                  See Features
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
