import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const ForTeamsPage = () => {
  const teamSegments = [
    {
      icon: "code",
      title: "Engineering Teams",
      desc: "Stop the 'what was the API decision?' debates. Turn technical discussions into trackable action items.",
      points: [
        "Direct extraction of technical debt and architectural decisions.",
        "Auto-sync with GitHub Issues and Jira backlogs.",
        "Clear ownership for bug fixes and infrastructure tasks."
      ],
      img: "/engineering.png"
    },
    {
      icon: "palette",
      title: "Product & Design",
      desc: "Ensure every feedback session results in a concrete action item. Bridge the gap between vision and execution.",
      points: [
        "Capture design critiques and feedback loops instantly.",
        "Track roadmap pivots and feature priority changes.",
        "Automated follow-ups for cross-functional stakeholders."
      ],
      img: "/product.png"
    },
    {
      icon: "leaderboard",
      title: "Leadership & Execs",
      desc: "Get a bird's-eye view of organizational accountability without micromanaging.",
      points: [
        "Visualize team-wide velocity and commitment completion rates.",
        "Identify structural bottlenecks before they impact the bottom line.",
        "Centralized 'Source of Truth' for all strategic decisions."
      ],
      img: "/leadership.png"
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
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">FOR EVERY TEAM</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Scale Your Team's <span className="text-orange-500">Accountability</span> Without the Friction
          </h1>
          <p className="text-[18px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Whether you are shipping code or closing deals, MeetLoop ensures that every meeting result is tracked to the finish line.
          </p>
        </div>
      </section>

      {/* Team Segments Grid */}
      <div className="max-w-7xl mx-auto px-8 space-y-32 pb-32">
        {teamSegments.map((segment, index) => (
          <section key={index} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className={index % 2 === 1 ? 'md:order-2' : 'md:order-1'}>
              <div className="flex items-center gap-4 mb-6 text-orange-500">
                <span className="material-symbols-outlined text-4xl">{segment.icon}</span>
                <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{segment.title}</h2>
              </div>
              <ul className="space-y-4 mb-10">
                {segment.points.map((point, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-orange-500 mt-1">check_circle</span>
                    <span className="text-gray-400 text-lg leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 px-8 py-3 rounded-xl text-white transition-all inline-flex items-center gap-2 group font-semibold">
                Get Started for {segment.title.split(' ')[0]} <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className={`${index % 2 === 1 ? 'md:order-1' : 'md:order-2'} glass-card rounded-2xl overflow-hidden aspect-video relative group border-white/5`}>
              <img src={segment.img} alt={segment.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] to-transparent"></div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-[#111113] border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-10" style={{ fontFamily: 'Space Grotesk' }}>Ready to unify your team?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-orange-500/20">
              Join the Workspace
            </Link>
            <Link to="/login" className="border border-white/10 hover:bg-white/5 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all">
              Sign In to Workspace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForTeamsPage;
