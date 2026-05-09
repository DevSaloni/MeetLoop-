import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HowItWorksPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const steps = [
    {
      num: 1,
      title: "Lead: Paste the Record.",
      desc: "The Team Lead drops in raw transcripts or meeting notes. MeetLoop is built for speed—just paste and go. No manual sorting required.",
      img: "/features/ai-extraction.png"
    },
    {
      num: 2,
      title: "AI: Intelligent Extraction.",
      desc: "Our engine instantly identifies 'Commitment Cards.' It maps out who said they would do what, effectively creating your action plan in seconds.",
      img: "/features/engineering.png"
    },
    {
      num: 3,
      title: "Contributor: Digital Handshake.",
      desc: "Every assigned member gets a notification. They review their specific tasks and click 'Confirm Agreement.' This is where verbal promises become locked-in commitments.",
      img: "/features/confirmation.png"
    },
    {
      num: 4,
      title: "Loop: Smart Reminders.",
      desc: "MeetLoop stays on top of the work. Contributors receive subtle nudges across Slack or Teams to ensure deadlines are met without manager intervention.",
      img: "/features/reminders.png"
    },
    {
      num: 5,
      title: "Lead: Real-time Visibility.",
      desc: "Team Leads watch the 'Accountability Graph' and reliability scores. Identify bottlenecks instantly before they escalate.",
      img: "/features/accountability-graph.png"
    },
    {
      num: 6,
      title: "Archive: Decision Log.",
      desc: "Every final answer and strategic choice is saved. Searchable, verifiable, and permanent. The loop is closed and the 'Source of Truth' is secured.",
      img: "/features/decision-log.png"
    }
  ];

  const faqs = [
    { q: "How secure is my meeting data?", a: "MeetLoop uses enterprise-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. We are SOC2 Type II compliant and offer private cloud deployments for enterprise customers." },
    { q: "Can I integrate with my current tools?", a: "Yes, MeetLoop supports native integrations with Slack, Microsoft Teams, Linear, Jira, and GitHub. Our API also allows for custom workflow automation via Zapier or direct webhooks." },
    { q: "Is there a limit on meeting length?", a: "The Pro plan supports meetings up to 4 hours in length with unlimited AI processing. Free trials are capped at 45 minutes per session." },
    { q: "Does it support multiple languages?", a: "MeetLoop supports transcription and task extraction in over 50 languages, including English, Spanish, Mandarin, German, and Japanese." },
    { q: "How does the accountability tracking work?", a: "We use a system of nudges and status updates. If a task is assigned and goes unaddressed, MeetLoop can automatically remind the owner via their preferred communication channel." },
    { q: "What happens after my free trial?", a: "After 14 days, you'll be moved to our Free tier with limited processing credits. Your data remains accessible, but you'll need a Pro subscription to unlock advanced AI features." }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-28 overflow-hidden bg-gradient-to-b from-orange-500/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center px-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">PRODUCT WALKTHROUGH</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Simple Enough for Any Team <span className="text-orange-500">Powerful Enough</span> for Any Meeting.
          </h1>
          <p className="text-[18px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform chaos into clarity. From initial setup to team-wide accountability, MeetLoop streamlines every aspect of your professional collaborations.
          </p>
        </div>
      </section>

      {/* 6-Step Visual Guide */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 animate-fade-in`}>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full font-bold text-xl">
                    {step.num}
                  </span>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{step.title}</h2>
                </div>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  {step.desc}
                </p>
                {step.features && (
                  <ul className="space-y-3">
                    {step.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white">
                        <span className="material-symbols-outlined text-orange-500 text-[18px]">check_circle</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="w-full md:w-1/2 glass-card rounded-2xl p-2 overflow-hidden shadow-2xl border-white/5">
                <div className="w-full h-[360px] bg-[#111113] rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                  <img className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" src={step.img} alt={step.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0E0E10] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about getting started with MeetLoop.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-xl overflow-hidden border border-white/5">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-22 max-w-7xl mx-auto px-8">
        <div className="glass-card rounded-[32px] p-16 flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-orange-500/5 blur-[120px] -z-10"></div>
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Ready to Loop in Your Team?</h2>
          <p className="text-lg text-gray-400 max-w-2xl mb-10">
            Join 500+ high-performance teams using MeetLoop to turn conversations into actionable progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20">
              Get Started Now
            </button>
            <button className="border border-white/10 hover:bg-white/5 text-white px-10 py-4 rounded-xl font-bold transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
