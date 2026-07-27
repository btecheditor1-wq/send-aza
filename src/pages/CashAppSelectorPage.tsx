import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Smartphone } from 'lucide-react';

export const CashAppSelectorPage: React.FC = () => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 'template1',
      title: 'Template 1',
      subtitle: 'Classic Activity Receipt',
      image: '/cashapp1.png',
      fallbackImage: '/cashapp/images/cashapp1.png',
      path: '/cashapp/template1.html',
    },
    {
      id: 'template2',
      title: 'Template 2',
      subtitle: 'Web Payment Details',
      image: '/cashapp2.png',
      fallbackImage: '/cashapp/images/cashapp2.png',
      path: '/cashapp/template2.html',
    },
  ];

  const handleSelectTemplate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-16 font-sans">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/select-country')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1 px-2.5 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cash App Selector</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-8 sm:pt-10">
        {/* Main Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase text-center mb-2">
            CHOOSE CASHAPP RECEIPT TYPE
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Select a template below to generate a custom Cash App receipt
          </p>
        </div>

        {/* Template Grid: 2 Columns on Mobile */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {templates.map((tpl, idx) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileTap={{ scale: 0.96 }}
              className="group cursor-pointer flex flex-col items-center"
              onClick={() => handleSelectTemplate(tpl.path)}
            >
              {/* Phone Mockup Image Card */}
              <div className="relative w-full rounded-2xl sm:rounded-3xl bg-slate-950 p-2 sm:p-2.5 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-200 border border-slate-200/80 overflow-hidden">
                {/* Phone Notch/Speaker bar */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1.5 bg-slate-800 rounded-full z-10 opacity-70" />

                {/* Mockup Frame Screen */}
                <div className="w-full aspect-[9/18] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 relative">
                  <img
                    src={tpl.image}
                    alt={tpl.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback image source if primary fail
                      const target = e.target as HTMLImageElement;
                      if (target.src !== tpl.fallbackImage) {
                        target.src = tpl.fallbackImage;
                      }
                    }}
                  />

                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-colors flex items-end justify-center p-3">
                    <span className="text-[10px] sm:text-xs font-bold text-white bg-slate-900/90 backdrop-blur-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      Select Template
                    </span>
                  </div>
                </div>
              </div>

              {/* Template Title Underneath */}
              <div className="mt-3 text-center">
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {tpl.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>Tap any template above to open its dedicated generator.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
