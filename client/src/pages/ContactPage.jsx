import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomSelect from '../components/ui/CustomSelect';
import axios from 'axios';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  const { baseUrl } = useAuth();

  React.useEffect(() => {
    document.title = "Contact Us | MeetLoop - Support & Inquiries";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Get in touch with the MeetLoop team for support, enterprise sales, or feedback. We're here to help your team close the loop.");
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/misc/contact`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', subject: 'General Question', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = [
    { label: 'Book a Team Onboarding Demo', value: 'Demo Request' },
    { label: 'Enterprise & Scalability Solutions', value: 'Enterprise Inquiry' },
    { label: 'AI Accuracy & Feature Feedback', value: 'Product Feedback' },
    { label: 'Technical Support & API Access', value: 'Technical Support' },
    { label: 'General Partnership Inquiry', value: 'General Inquiry' }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E1E4]">
      <Navbar />

      {/* Main Contact Section */}
      <section className="relative w-full min-h-screen">
        <div className="w-full flex flex-col lg:flex-row min-h-screen">

          {/* Visual Side */}
          <div className="lg:w-1/2 relative overflow-hidden flex flex-col justify-center py-20 md:py-32 px-6 md:px-10 lg:pl-16 lg:pr-10 border-b lg:border-b-0 border-white/5 min-h-[500px] lg:min-h-screen">
            <div className="absolute inset-0">
              <img
                src="/contact-hero.jpg"
                alt="Productive Team Meeting"
                className="w-full h-full object-cover object-top opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
              <div className="absolute inset-0 backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 space-y-4 md:space-y-6">
              {/* HEADING - Match Landing Page Scale */}
              <h1 className="text-white font-bold leading-[1.05] tracking-tight text-[32px] md:text-[40px] lg:text-[54px]" style={{ fontFamily: "Space Grotesk" }}>
                Let's Build <br />
                <span className="text-orange-500">Accountability</span> Together.
              </h1>

              {/* DESCRIPTION - Match Landing Page Style */}
              <p className="text-gray-400 text-sm md:text-base lg:text-[16px] leading-relaxed max-w-[480px]">
                Transform how your team works. Reach out for a demo, enterprise support, or to discuss how we can help you close the loop.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-1/2 bg-black p-6 md:p-10 lg:p-16 flex flex-col justify-center py-16 md:py-20 lg:py-32 border-l border-white/5">
            <div className="max-w-2xl w-full mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full h-12 md:h-14 bg-white/[0.02] border border-white/10 rounded-lg px-4 focus:border-orange-500/50 focus:outline-none transition-all text-white text-sm placeholder:text-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] ml-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full h-12 md:h-14 bg-white/[0.02] border border-white/10 rounded-lg px-4 focus:border-orange-500/50 focus:outline-none transition-all text-white text-sm placeholder:text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] ml-1">How can we help?</label>
                  <CustomSelect
                    options={subjectOptions}
                    value={formData.subject}
                    onChange={(val) => setFormData({ ...formData, subject: val })}
                    className="h-12 md:h-14"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] ml-1">Your Message</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your team's workflow challenges..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-4 focus:border-orange-500/50 focus:outline-none transition-all text-white text-sm placeholder:text-gray-800 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold uppercase tracking-[0.2em] rounded-lg transition-all shadow-[0_20px_50px_rgba(249,115,22,0.15)] flex items-center justify-center gap-3 group"
                  >
                    {loading ? 'Processing...' : 'Send Message'}
                    <span className="material-symbols-outlined group-hover:translate-x-1.5 transition-transform text-base">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
