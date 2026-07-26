import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Sparkles, Lock } from 'lucide-react';
import { AzaLogo } from '../components/AzaLogo';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/select-country');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-slate-50 via-blue-50/70 to-purple-50/60 text-slate-900 flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-10 -left-16 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-16 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-2 z-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 shadow-xs text-[11px] font-bold text-slate-600 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Educational Banking Portal</span>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full max-w-sm my-auto flex flex-col items-center text-center z-10 space-y-8">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <AzaLogo size="xl" showText={true} />
        </motion.div>

        {/* Information Card with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full relative group"
        >
          {/* Subtle card glow border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-emerald-400/30 rounded-3xl blur-xs group-hover:opacity-100 transition duration-300" />

          <div className="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-2xl shadow-blue-900/5 text-center flex flex-col items-center space-y-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 border border-amber-200/80 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <p className="text-slate-900 font-bold text-sm md:text-base leading-relaxed tracking-tight">
              <span className="text-amber-700 font-extrabold">Note:</span> This website is completely free and is created strictly for educational purposes only. It must never be used for illegal or fraudulent activities.
            </p>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure UI Prototype</span>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <button
            onClick={handleContinue}
            className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold text-base md:text-lg shadow-xl shadow-indigo-500/25 active:scale-98 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
          >
            {/* Button subtle shimmer layer */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <span>Continue</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs font-semibold text-slate-400 z-10 text-center"
      >
        Send Aza &copy; {new Date().getFullYear()} &bull; Educational Mobile Web
      </motion.div>
    </div>
  );
};
