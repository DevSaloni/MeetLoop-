import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const FeaturesPage = () => {
  const detailedFeatures = [
    {
      role: "FOR TEAM LEADS",
      icon: "psychology",
      title: "AI Task Extraction",
      desc: "Problem: Leads spend hours writing minutes and follow-ups. Solution: MeetLoop auto-extracts every task, owner, and deadline instantly.",
      points: [
        "Real-time identification of action items and owners during the conversation.",
        "Zero manual data entry for managers after meetings.",
        "Context-aware summaries that capture the 'Why' behind every task assigned."
      ],
      img: "/features/ai-extraction.png"
    },
    {
      role: "FOR CONTRIBUTORS",
      icon: "verified_user",
      title: "Confirmation Layer",
      desc: "Problem: Tasks are often 'assigned' without the worker agreeing. Solution: A digital handshake that requires explicit confirmation.",
      points: [
        "Explicit 'I agree' or 'Need clarification' buttons for every extracted task.",
        "Protects contributors from 'Scope Creep' and unconfirmed verbal changes.",
        "Legal-grade audit trails for critical project decisions and approvals."
      ],
      img: "/features/confirmation.png"
    },
    {
      role: "FOR TEAM LEADS",
      icon: "hub",
      title: "Accountability Graph",
      desc: "Problem: Bottlenecks are invisible until projects are late. Solution: Visualize the web of commitments across your entire team.",
      points: [
        "Identify bottlenecks where tasks are stalling before they impact deadlines.",
        "Measure individual and team 'Reliability Scores' based on follow-through history.",
        "Automatic flagging of overdue tasks that are on the critical path."
      ],
      img: "/features/accountability-graph.png"
    },
    {
      role: "FOR CONTRIBUTORS",
      icon: "notifications_active",
      title: "Smart Reminders",
      desc: "Problem: Forgotten tasks lead to stress and late nights. Solution: Multi-channel delivery of deadlines to keep you on track.",
      points: [
        "Intelligent follow-ups scheduled based on the priority of the task.",
        "Multi-channel delivery: Slack, Microsoft Teams, Email, or SMS alerts.",
        "Snooze logic that learns when you are most likely to actually complete a task."
      ],
      img: "/features/reminders.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 md:py-32 overflow-hidden bg-gradient-to-b from-orange-500/10 to-transparent">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">CORE FEATURES</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Everything You Need to <span className="text-orange-500">Execute After </span> Every Meeting
          </h1>
          <p className="text-[18px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            MeetLoop transforms verbal agreements into verifiable progress. Stop losing momentum the moment the call ends.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-8 space-y-32 pb-32">
        {detailedFeatures.map((feature, index) => (
          <section key={index} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className={index % 2 === 1 ? 'md:order-2' : 'md:order-1'}>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{feature.role}</span>
              </div>
              <div className="flex items-center gap-4 mb-6 text-orange-500">
                <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
                <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{feature.title}</h2>
              </div>
              <ul className="space-y-4 mb-10">
                {feature.points.map((point, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-orange-500 mt-1">check_circle</span>
                    <span className="text-gray-400 text-lg leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <button className="bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 px-8 py-3 rounded-xl text-white transition-all flex items-center gap-2 group font-semibold">
                Explore {feature.title} <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className={`${index % 2 === 1 ? 'md:order-1' : 'md:order-2'} glass-card rounded-2xl overflow-hidden aspect-video relative group border-white/5`}>
              <img src={feature.img} alt={feature.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] to-transparent"></div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-[#111113] border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-10" style={{ fontFamily: 'Space Grotesk' }}>Ready to loop in the whole team?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-orange-500/20">
              Get Started
            </button>
            <button className="border border-white/10 hover:bg-white/5 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
