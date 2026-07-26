import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Sparkles } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SelectionCard } from '../components/Card';
import { NIGERIA_BANKS, SelectionItem } from '../data/appData';

export const NigeriaBanksPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBankSelect = (bank: SelectionItem) => {
    if (bank.id === 'access' || bank.targetPath === '/nigeria-banks/access/receipt') {
      navigate('/nigeria-banks/access/receipt');
    } else if (bank.targetPath) {
      navigate(bank.targetPath);
    } else {
      navigate('/not-available');
    }
  };

  const filteredBanks = NIGERIA_BANKS.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bank.subtext && bank.subtext.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Sticky Navigation Bar with Back Button */}
      <Navbar showBack={true} />

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Page Heading Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nigerian Banking Partners</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Choose Your Preferred Nigerian Bank
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Select a commercial or digital microfinance bank to proceed
          </p>
        </motion.div>

        {/* Bank Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bank name (e.g., GTBank, OPay, Kuda)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Banks Responsive Grid (2 columns on mobile) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>Available Financial Institutions</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-extrabold text-[10px]">
                {filteredBanks.length}
              </span>
            </h2>
          </div>

          {filteredBanks.length > 0 ? (
            <div className="grid grid-cols-2 gap-3.5">
              {filteredBanks.map((bank, idx) => (
                <motion.div
                  key={bank.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                >
                  <SelectionCard
                    item={bank}
                    onClick={() => handleBankSelect(bank)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">No banks found</p>
              <p className="text-xs text-slate-500 mt-1">
                Check spelling or search for another financial provider.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
