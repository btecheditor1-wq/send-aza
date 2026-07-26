import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Home,
  Building2,
  Globe2,
  Info,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AzaLogo } from './AzaLogo';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDisclaimer: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  onOpenDisclaimer,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50"
          />

          {/* Drawer Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-slate-900 text-white z-50 shadow-2xl flex flex-col justify-between border-l border-white/10 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <AzaLogo size="sm" />
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-5 space-y-6 flex-1">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Navigation
                </p>
                <nav className="space-y-2">
                  <button
                    onClick={() => handleNavigation('/select-country')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      location.pathname === '/select-country' || location.pathname === '/'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Globe2 className="w-4 h-4 text-emerald-400" />
                    Country Selection
                  </button>

                  <button
                    onClick={() => handleNavigation('/nigeria-banks')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      location.pathname === '/nigeria-banks'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Nigerian Banks
                  </button>

                  <button
                    onClick={() => handleNavigation('/')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <Home className="w-4 h-4 text-purple-400" />
                    Welcome Screen
                  </button>
                </nav>
              </div>

              {/* Information & Disclaimer Section */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Information & Legal
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onOpenDisclaimer();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left bg-white/5 border border-white/5"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Educational Disclaimer</span>
                  </button>
                </div>
              </div>

              {/* Educational Highlight Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Educational Applet</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Send Aza is built strictly for demonstration & UI research purposes. No live transactions occur.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/10 text-center text-[11px] text-slate-500">
              <p>Send Aza Mobile Web v1.0.0</p>
              <p className="mt-0.5">Educational UI Prototype</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
