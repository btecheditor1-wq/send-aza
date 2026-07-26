import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { SelectionItem } from '../data/appData';
import { ItemLogo } from './ItemLogo';

interface CardProps {
  item: SelectionItem;
  onClick: () => void;
}

export const SelectionCard: React.FC<CardProps> = ({ item, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="group relative cursor-pointer flex flex-col justify-between p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 overflow-hidden"
    >
      {/* Background soft ambient gradient highlight */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.brandColor || 'from-blue-500/5 to-purple-500/5'} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

      {/* Top row: Badge or Availability Indicator */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        {item.badge ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200/60 shadow-xs">
            {item.badge}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400/80" />
            Verified
          </span>
        )}

        <div className="w-6 h-6 rounded-full bg-slate-100/80 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors duration-300">
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Center: Flag / Icon / Logo */}
      <div className="relative z-10 flex flex-col items-center my-2">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 p-2 shadow-inner border border-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <ItemLogo id={item.id} name={item.name} fallbackImage={item.image} />
        </div>

        {/* Title with Flag Emoji if present */}
        <h3 className="mt-3 font-bold text-slate-900 text-center text-sm md:text-base leading-snug group-hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5">
          {item.flagEmoji && <span className="text-base">{item.flagEmoji}</span>}
          <span>{item.name}</span>
        </h3>

        {/* Subtext */}
        {item.subtext && (
          <p className="mt-0.5 text-[11px] text-slate-500 text-center font-medium line-clamp-1">
            {item.subtext}
          </p>
        )}
      </div>

      {/* Bottom Indicator */}
      <div className="relative z-10 mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span className={item.available ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
          {item.available ? 'Active' : 'Select'}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
};
