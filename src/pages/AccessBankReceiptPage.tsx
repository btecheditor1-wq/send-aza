import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Clock,
  User,
  CreditCard,
  Banknote,
  FileText,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ALL_NIGERIAN_BANKS } from '../data/appData';
import { ItemLogo } from '../components/ItemLogo';

export const AccessBankReceiptPage: React.FC = () => {
  const navigate = useNavigate();

  // Helper to format default date YYYY-MM-DD and time HH:MM
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  // Form States
  const [amount, setAmount] = useState('10,000.00');
  const [senderName, setSenderName] = useState('BENJAMIN GEORGE');
  const [receiverName, setReceiverName] = useState('RAKIYA GEORGE');
  const [receiverAccount, setReceiverAccount] = useState('0116464944');
  const [receiverBank, setReceiverBank] = useState('OPAY LIMITED');
  const [narration, setNarration] = useState('BENNIE');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);

  // Bank dropdown search state
  const [bankSearch, setBankSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filtered bank list for search dropdown
  const filteredBanks = ALL_NIGERIAN_BANKS.filter((bank) =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const generateRandomDigits = (count: number): string => {
    let digits = '';
    for (let i = 0; i < count; i++) {
      digits += Math.floor(Math.random() * 10).toString();
    }
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format amount cleanly (ensure ₦ and decimals if needed)
    let cleanedAmount = amount.trim();
    if (!cleanedAmount.startsWith('₦')) {
      cleanedAmount = `₦${cleanedAmount}`;
    }

    const refCode = `NXG0000${generateRandomDigits(26)}`;
    const sessionId = generateRandomDigits(30);

    const formData = {
      amount: cleanedAmount,
      senderName,
      receiverName,
      receiverAccount,
      receiverBank,
      narration: narration.trim() || 'N/A',
      date,
      time,
      refCode,
      sessionId,
    };

    // Save to sessionStorage for persistence across direct reloads
    sessionStorage.setItem('access_receipt_data', JSON.stringify(formData));

    // Navigate to Page 2
    navigate('/nigeria-banks/access/generated', { state: { formData } });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      <Navbar showBack={true} />

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          {/* Access Bank Logo Centered at Top */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-white p-3 shadow-lg shadow-amber-500/10 border border-amber-200/80 flex items-center justify-center overflow-hidden">
              <ItemLogo
                id="access"
                name="Access Bank"
                fallbackImage="/assets/access.png"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Access Bank Receipt Generator
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Fill in the transaction details below.
            </p>
          </div>
        </motion.div>

        {/* Premium Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/80 border border-slate-200/80 space-y-5"
        >
          {/* Access Bank Form Header Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center overflow-hidden shadow-xs">
                <ItemLogo
                  id="access"
                  name="Access Bank"
                  fallbackImage="/assets/access.png"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">Access Bank PLC</h2>
                <p className="text-[11px] font-semibold text-amber-600">Transfer Receipt Form</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black tracking-wider uppercase">
              Official
            </span>
          </div>
          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-amber-600" />
              <span>Amount</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-base font-bold text-amber-600">
                ₦
              </span>
              <input
                type="text"
                value={amount.replace(/^₦/, '')}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10,000.00"
                required
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Sender's Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              <span>Sender's Name</span>
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. BENJAMIN GEORGE"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase transition-all"
            />
          </div>

          {/* Receiver's Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              <span>Receiver's Name</span>
            </label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="e.g. RAKIYA GEORGE"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase transition-all"
            />
          </div>

          {/* Receiver's Account Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Receiver's Account Number</span>
            </label>
            <input
              type="text"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              placeholder="e.g. 0116464944"
              required
              maxLength={10}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 tracking-wider transition-all"
            />
          </div>

          {/* Receiver's Bank Dropdown */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Receiver's Bank</span>
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors focus:outline-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="uppercase">{receiverBank}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 z-30 p-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="relative sticky top-0 bg-white pt-1 pb-2">
                  <Search className="absolute left-3 top-3.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Nigerian bank..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  {filteredBanks.map((bankName) => (
                    <button
                      key={bankName}
                      type="button"
                      onClick={() => {
                        setReceiverBank(bankName.toUpperCase());
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        receiverBank.toLowerCase() === bankName.toLowerCase()
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{bankName}</span>
                      {receiverBank.toLowerCase() === bankName.toLowerCase() && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Narration (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Narration (Optional)</span>
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g. BENNIE or Payment for goods"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase transition-all"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Generate Receipt Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>Generate Receipt</span>
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};
