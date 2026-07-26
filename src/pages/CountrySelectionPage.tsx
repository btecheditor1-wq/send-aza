import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, CreditCard, Sparkles } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SelectionCard } from '../components/Card';
import { COUNTRIES, OTHER_SERVICES, SelectionItem } from '../data/appData';

export const CountrySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (item: SelectionItem) => {
    if (item.targetPath) {
      navigate(item.targetPath);
    } else {
      navigate('/not-available');
    }
  };

  const filteredCountries = COUNTRIES.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOthers = OTHER_SERVICES.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Sticky Top Navigation */}
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Main Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Global Remittance Destinations</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Choose Your Preferred Country
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Select a destination country or wallet service to continue
          </p>
        </motion.div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search country or provider..."
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

        {/* Countries Grid Section */}
        {filteredCountries.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span>Countries</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-extrabold">
                  {filteredCountries.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {filteredCountries.map((country, idx) => (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <SelectionCard
                    item={country}
                    onClick={() => handleSelect(country)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Others Section */}
        {filteredOthers.length > 0 && (
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-5">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Others</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold">
                  {filteredOthers.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {filteredOthers.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <SelectionCard
                    item={item}
                    onClick={() => handleSelect(item)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* No Search Results State */}
        {filteredCountries.length === 0 && filteredOthers.length === 0 && (
          <div className="py-12 text-center bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">No match found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another country or payment service name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
