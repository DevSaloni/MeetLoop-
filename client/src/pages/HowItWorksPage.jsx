import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HowItWorksPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    document.title = "How It Works | MeetLoop - The Accountability Engine";
  }, []);

  const steps = [
    {
      num: 1,
      title: "Onboard Your Team.",
      desc: "Start by creating your workspace. Every team gets a unique invite code. Share it with your colleagues to bring everyone into the loop instantly.",
      img: "/teams.png"
    },
    {
      num: 2,
      title: "Paste the Record.",
      desc: "Drop your raw transcripts or meeting notes into the 'New Meeting' portal. MeetLoop is built for speed—just paste the text and let our engine do the heavy lifting.",
      img: "/paste.png"
    },
    {
      num: 3,
      title: "AI Extraction.",
      desc: "Gemini AI instantly identifies 'Commitment Cards.' It automatically maps out who said they would do what, creating a structured action plan in seconds.",
      img: "/ai_extraction.png"
    },
    {
      num: 4,
      title: "The Digital Handshake.",
      desc: "Every assigned member sees their tasks on their dashboard. They review their specific commitments and click 'Confirm Agreement.' This transforms talk into accountability.",
      img: "/handshake.png"
    },
    {
      num: 5,
      title: "Global Discovery.",
      desc: "Need to find a past decision? Use the universal search bar to find any meeting, team, or commitment across your entire workspace in real-time.",
      img: "/search.png"
    },
    {
      num: 6,
      title: "Close the Loop.",
      desc: "Track execution with Reliability Scores. See who is delivering and celebrate your team's progress as tasks move from 'Open' to 'Done'.",
      img: "/analytics.png"
    }
  ];

  const faqs = [
    {
      q: "How does MeetLoop turn my meeting notes into tasks?",
      a: "Paste your transcript into the New Meeting form. Gemini AI reads it, extracts every action item, assigns it to the right person, sets a priority, and generates an executive summary — all in seconds."
    },
    {
      q: "What is a Reliability Score?",
      a: "It's your personal performance metric: tasks completed ÷ total tasks assigned × 100. A score above 90% shows as Excellent on your dashboard. It updates live every time you mark a task done."
    },
    {
      q: "Do all team members need an account?",
      a: "Yes. Each member gets their own dashboard to view and complete their tasks. The Team Lead shares a unique team code — members sign up and join instantly."
    },
    {
      q: "Can I manage multiple teams?",
      a: "Absolutely. Create separate workspaces for Engineering, Marketing, or any department. All teams appear in your sidebar and each has its own meetings, tasks, and analytics."
    },
    {
      q: "What if the AI misses a task or assigns it wrong?",
      a: "You stay in full control. Edit the transcript anytime from the Notes tab, then hit 'Refresh AI Context' to re-run the analysis. All existing task statuses are preserved."
    },
    {
      q: "How does the Team Lead send reminders?",
      a: "From the Meeting Details page, leads click the bell icon on any overdue task. An accountability notification is sent directly to that team member's dashboard — no email or chat needed."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-orange-500/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center px-6 md:px-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">PRODUCT WALKTHROUGH</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Simple Enough for Any Team <span className="text-orange-500">Powerful Enough</span> for Any Meeting.
          </h1>
          <p className="text-base md:text-[18px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform chaos into clarity. From initial setup to team-wide accountability, MeetLoop streamlines every aspect of your professional collaborations.
          </p>
        </div>
      </section>

      {/* 6-Step Visual Guide */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 md:px-8">
        <div className="space-y-20 md:space-y-32">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 animate-fade-in`}>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-4 mb-5 md:mb-6">
                  <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-orange-500 text-white rounded-2xl font-bold text-lg md:text-xl shrink-0 shadow-lg shadow-orange-500/20">
                    {step.num}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>{step.title}</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-0 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="w-full md:w-1/2 glass-card rounded-3xl p-2 md:p-3 overflow-hidden shadow-2xl border-white/5 relative group">
                <div className="absolute inset-0 bg-orange-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-full aspect-[16/10] bg-[#111113] rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 relative z-10">
                  <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105" src={step.img} alt={step.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-[#0E0E10] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">KNOWLEDGE BASE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'Space Grotesk' }}>Frequently Asked Questions</h2>
            <p className="text-gray-400 text-base md:text-lg">Real answers about what MeetLoop actually does inside your workspace.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full px-6 md:px-8 py-6 md:py-7 flex justify-between items-center text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-bold text-white text-sm md:text-base pr-8">{faq.q}</span>
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === index ? 'bg-orange-500 text-white rotate-180' : 'bg-white/5 text-gray-400'}`}>
                    <span className="material-symbols-outlined text-lg md:text-xl">expand_more</span>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${openFaq === index ? 'max-h-[500px] pb-6 md:pb-8' : 'max-h-0'}`}>
                  <div className="px-6 md:px-8">
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed border-l-2 border-orange-500/40 pl-5 md:pl-6">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
