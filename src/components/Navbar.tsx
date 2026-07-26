import React, { useState } from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AzaLogo } from './AzaLogo';
import { Drawer } from './Drawer';
import { DisclaimerModal } from './DisclaimerModal';

interface NavbarProps {
  showBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showBack = false }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-xs">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="mr-1 p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => navigate('/select-country')}
              className="flex items-center text-left focus:outline-hidden"
            >
              <AzaLogo size="sm" showText={true} />
            </button>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 border border-slate-200/60 shadow-xs transition-all active:scale-95 flex items-center justify-center group"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-slate-800 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </>
  );
};
