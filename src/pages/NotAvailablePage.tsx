import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const NotAvailablePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/select-country');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Sticky Header Navbar */}
      <Navbar showBack={true} />

      {/* Main Centered Content Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col items-center justify-center text-center my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-full flex flex-col items-center space-y-6"
        >
          {/* Modern Information Icon Card with Animated Halo */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-xl group-hover:opacity-100 transition duration-500"></div>

            <div className="relative w-24 h-24 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/80 flex items-center justify-center text-indigo-600">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <Clock className="w-10 h-10 text-indigo-600 animate-pulse" />
              </div>

              <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-amber-400 text-slate-950 border-2 border-white shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Not Available Yet
            </h1>
            <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs mx-auto">
              This section is currently under development. Please check back later as more receipt examples will be added.
            </p>
          </div>

          {/* Development Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Active Module Expansion in Progress</span>
          </div>

          {/* Back Home Button */}
          <div className="w-full pt-4">
            <button
              onClick={handleBackHome}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 hover:from-slate-800 hover:to-indigo-900 text-white font-bold text-base shadow-lg shadow-slate-900/15 active:scale-98 transition-all flex items-center justify-center gap-2.5"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back Home</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Clean Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 font-medium">
        Send Aza &bull; Educational Preview Mode
      </footer>
    </div>
  );
};
