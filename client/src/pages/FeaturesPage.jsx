import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const FeaturesPage = () => {
  const { user } = useAuth();
  const detailedFeatures = [
    {
      role: "FOR TEAM LEADS",
      icon: "psychology",
      title: "AI Task Extraction",
      desc: "Paste your raw meeting transcript and Gemini AI does the rest — extracting every task, assigning owners, setting priorities, and writing an executive summary automatically.",
      points: [
        "Auto-assigns tasks to the right team members from transcript context.",
        "Generates HIGH / MEDIUM / LOW priority for every action item.",
        "Creates an AI executive summary and captures formal decisions in one pass."
      ],
      img: "/ai_extraction.png"
    },
    {
      role: "FOR CONTRIBUTORS",
      icon: "task_alt",
      title: "Personal Commitments Hub",
      desc: "Every team member gets a dedicated dashboard that groups all their assigned tasks by meeting — with live stats and one-click completion.",
      points: [
        "Filter your tasks by All, Open, Overdue, or Done in a single click.",
        "See your real-time Completion Rate and Overdue count at the top.",
        "Mark tasks done with a checkbox — instantly synced across the team."
      ],
      img: "/handshake.png"
    },
    {
      role: "FOR TEAM LEADS",
      icon: "monitoring",
      title: "Analytics & Reliability Score",
      desc: "Track exactly how well your team executes. The Analytics dashboard shows a live leaderboard, task velocity chart, and priority breakdown — all from real data.",
      points: [
        "Reliability Score = (Tasks Done ÷ Total Tasks) × 100, updated live.",
        "Team Leaderboard ranked by performance with a punctuality penalty for overdue tasks.",
        "Task Velocity chart shows completion trends across your last 7 meetings."
      ],
      img: "/analytics.png"
    },
    {
      role: "FOR TEAM LEADS",
      icon: "notifications_active",
      title: "Accountability Reminders",
      desc: "Stop chasing people over Slack. Send a one-click accountability nudge to any team member directly from the meeting details — no external tools needed.",
      points: [
        "Bell icon on each task lets leads send instant in-app reminders.",
        "Notifications go directly to the assignee's dashboard.",
        "Reduces follow-up overhead and keeps projects unblocked."
      ],
      img: "/reminders.png"
    },

    {
      role: "FOR TEAM LEADS",
      icon: "gavel",
      title: "Decision Log",
      desc: "AI automatically captures formal decisions made during your meeting alongside tasks — so nothing important gets lost in the transcript.",
      points: [
        "Every decision is extracted with a title and description.",
        "Accessible in the Decisions tab inside each meeting detail view.",
        "Provides a permanent, searchable record of what was agreed upon."
      ],
      img: "/decision-log.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-orange-500/10 to-transparent">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">WHAT'S INSIDE MEETLOOP</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 leading-[1.1] tracking-tight text-white" style={{ fontFamily: 'Space Grotesk' }}>
            Built to Turn Meetings into <span className="text-orange-500">Measurable Results</span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every feature inside MeetLoop is designed to eliminate the gap between what gets discussed and what actually gets done.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-10 md:pt-16 space-y-20 md:space-y-32 pb-24 md:pb-32">
        {detailedFeatures.map((feature, index) => (
          <section key={index} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Text Side */}
            <div className={index % 2 === 1 ? 'md:order-2' : 'md:order-1'}>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{feature.role}</span>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                  {feature.title}
                </h2>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">{feature.desc}</p>
              <ul className="space-y-4">
                {feature.points.map((point, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1 w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-emerald-400 text-sm">check</span>
                    </div>
                    <span className="text-gray-300 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Side */}
            <div className={`${index % 2 === 1 ? 'md:order-1' : 'md:order-2'} relative group`}>
              <div className="absolute -inset-2 bg-gradient-to-br from-orange-500/15 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <div className="relative glass-card rounded-3xl overflow-hidden aspect-video border border-white/5 shadow-2xl">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5">
                  <span className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-orange-500 text-sm">{feature.icon}</span>
                    {feature.title}
                  </span>
                </div>
              </div>
            </div>

          </section>
        ))}
      </div>

      {/* CTA Banner - Responsive Optimized */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20 md:pb-32">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] py-10 md:py-12 px-6 md:px-12 text-center relative overflow-hidden group shadow-2xl shadow-orange-500/20">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              Start Closing the Loop Today
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-[500px] mx-auto mb-8 leading-relaxed">
              Join teams already using MeetLoop to convert every meeting into verifiable action.
            </p>
            {user ? (
              <Link
                to="/app"
                className="bg-white text-orange-600 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2 mx-auto w-fit"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span> Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-white text-orange-600 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2 mx-auto w-fit"
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span> Get Started Free
              </Link>
            )}
          </div>
          <span className="material-symbols-outlined absolute -bottom-16 -right-16 text-[200px] md:text-[260px] text-white opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
            verified
          </span>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
