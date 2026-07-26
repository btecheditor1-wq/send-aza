import React from 'react';

interface AzaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AzaLogo: React.FC<AzaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative group">
        {/* Glow halo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
        
        {/* Main Logo Mark */}
        <div
          className={`${iconSizes[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border border-white/20 shadow-xl text-white font-black tracking-wider overflow-hidden`}
        >
          {/* Subtle background geometric light */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-400/30 rounded-full blur-md"></div>
          <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-blue-500/30 rounded-full blur-md"></div>
          
          {/* Transfer A emblem */}
          <svg
            className="w-3/5 h-3/5 text-emerald-400 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L3 9l9 7 9-7-9-7z" className="text-blue-400" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 22V10" />
            <path d="M17 15l-5 5-5-5" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`${textSizes[size]} font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent drop-shadow-sm`}>
            Send <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Aza</span>
          </span>
          {size === 'xl' && (
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
              Educational Banking UI
            </span>
          )}
        </div>
      )}
    </div>
  );
};
