import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';

const AboutPage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4]">
      <SEOHead
        title="About Us — Our Mission to End Unproductive Meetings"
        description="Learn how MeetLoop was built to kill the unproductive meeting cycle. Our AI-powered platform bridges the gap between decisions and action for high-performance teams."
        path="/about"
        keywords="about MeetLoop, meeting productivity platform, team execution software, AI meeting accountability"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-orange-500/10 to-transparent">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">OUR MISSION</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 leading-[1.1] tracking-tight text-white" style={{ fontFamily: 'Space Grotesk' }}>
            We're Killing the <span className="text-orange-500">Unproductive Meeting</span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12">
            MeetLoop was born from a simple observation: millions of hours are wasted every year in meetings that result in zero action. We built a command center for teams that value execution over discussion.
          </p>

          <div className="grid grid-cols-2 md:flex md:justify-center gap-6 md:gap-8 items-center border-t border-white/5 pt-10 md:pt-12 max-w-2xl mx-auto">
            <div className="text-center md:text-left">
              <div className="text-white font-bold text-xl md:text-2xl" style={{ fontFamily: 'Space Grotesk' }}>2026</div>
              <div className="text-orange-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Founded</div>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/10"></div>
            <div className="text-center md:text-left">
              <div className="text-white font-bold text-xl md:text-2xl" style={{ fontFamily: 'Space Grotesk' }}>2k+</div>
              <div className="text-orange-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Tasks Tracked</div>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/10"></div>
            <div className="text-center md:text-left col-span-2 md:col-span-1">
              <div className="text-white font-bold text-xl md:text-2xl" style={{ fontFamily: 'Space Grotesk' }}>98%</div>
              <div className="text-orange-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">AI Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 border-t border-white/5">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>The Performance Gap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Most teams lose 40% of their momentum in the "post-meeting lag" — the gap between a decision and the first action.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
              MeetLoop was engineered to bridge this gap. We don't just record what happened; we codify the future.
            </p>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              By turning human speech into verifiable digital commitments, we ensure that every meeting moves the needle. Our system transforms talk into measurable project progress.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-3xl blur-2xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
            <div className="relative glass-card rounded-3xl p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
              <div className="space-y-6 md:space-y-8 relative z-10">
                <div className="flex gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                    <span className="material-symbols-outlined text-2xl md:text-3xl">bolt</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg md:text-xl mb-1" style={{ fontFamily: 'Space Grotesk' }}>Instant Extraction</h4>
                    <p className="text-gray-500 text-xs md:text-sm">Action items are identified and assigned before the meeting even ends.</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <span className="material-symbols-outlined text-2xl md:text-3xl">handshake</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg md:text-xl mb-1" style={{ fontFamily: 'Space Grotesk' }}>Digital Handshake</h4>
                    <p className="text-gray-500 text-xs md:text-sm">Every assignee must verify their commitment, creating a culture of ownership.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - Logically replacing generic values */}
      <section className="bg-[#0E0E10] py-16 md:py-32 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center  mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>The Execution Framework</h2>
            <p className="text-gray-400 max-w-[500px] mx-auto text-sm md:text-base">We don't measure features; we measure your team's success through these core pillars.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>100%</div>
              <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xs">Accountability</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">No "I forgot" or "I didn't know." Every task has a clear owner and a verified status.</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>0%</div>
              <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xs">Admin Overhead</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">AI handles the extraction, notification, and tracking. You just handle the execution.</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>92%</div>
              <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xs">Execution Rate</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">Average improvement in team task completion within the first 30 days of use.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Final CTA Banner - Optimized for Mobile */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20 md:pb-32 pt-20">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] py-10 md:py-12 px-6 md:px-12 text-center relative overflow-hidden group shadow-2xl shadow-orange-500/20">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              Join the Movement
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-[500px] mx-auto mb-8 leading-relaxed">
              Stop letting your best ideas evaporate after the meeting. Start looping them into action today.
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
                <span className="material-symbols-outlined text-lg">rocket_launch</span> Get Started for Free
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

export default AboutPage;
