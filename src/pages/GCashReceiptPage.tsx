import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Phone,
  Banknote,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Leaf,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ItemLogo } from '../components/ItemLogo';

const generate13DigitRef = (): string => {
  let result = '3';
  for (let i = 0; i < 12; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

const formatGCashDate = (d: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${month} ${day}, ${year} ${hours}:${minutes}${ampm}`;
};

export const GCashReceiptPage: React.FC = () => {
  const navigate = useNavigate();

  const now = new Date();
  const defaultFormattedDate = formatGCashDate(now);

  // Form States
  const [recipientName, setRecipientName] = useState('BE....GE');
  const [recipientNumber, setRecipientNumber] = useState('101949494949');
  const [amount, setAmount] = useState('1,000,000.00');
  const [refNumber, setRefNumber] = useState(generate13DigitRef());
  const [customDate, setCustomDate] = useState(defaultFormattedDate);
  const [carbonText, setCarbonText] = useState('131g (gCO2e)');

  const handleGenerateRef = () => {
    setRefNumber(generate13DigitRef());
  };

  const handleSamplePreset = (presetAmount: string, name: string, phone: string) => {
    setAmount(presetAmount);
    setRecipientName(name);
    setRecipientNumber(phone);
    setRefNumber(generate13DigitRef());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean amount input
    let cleanedAmount = amount.replace(/[^0-9.]/g, '');
    if (!cleanedAmount) {
      cleanedAmount = '1000000.00';
    }

    // Format number with commas for display
    const numAmount = parseFloat(cleanedAmount);
    const formattedAmountStr = isNaN(numAmount)
      ? '1,000,000.00'
      : numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const formData = {
      recipientName: recipientName.trim() || 'BE....GE',
      recipientNumber: recipientNumber.trim() || '101949494949',
      amount: formattedAmountStr,
      refNumber: refNumber.trim() || generate13DigitRef(),
      customDate: customDate.trim() || formatGCashDate(new Date()),
      carbonText: carbonText.trim() || '131g (gCO2e)',
    };

    try {
      sessionStorage.setItem('gcash_receipt_data', JSON.stringify(formData));
    } catch {
      // ignore
    }

    navigate('/gcash/generated', { state: { formData } });
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
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#005CE6] p-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center overflow-hidden">
              <ItemLogo
                id="gcash"
                name="GCash"
                fallbackImage="/assets/gcash.png"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              GCash Express Send Receipt Generator
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Create authentic GCash e-wallet transaction receipts
            </p>
          </div>
        </motion.div>

        {/* Quick Presets */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Quick Presets</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSamplePreset('1,000,000.00', 'BE....GE', '101949494949')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 transition-colors shadow-2xs"
            >
              ₱1,000,000.00
            </button>
            <button
              type="button"
              onClick={() => handleSamplePreset('5,000.00', 'MA....RO', '09171234567')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 transition-colors shadow-2xs"
            >
              ₱5,000.00
            </button>
            <button
              type="button"
              onClick={() => handleSamplePreset('500.00', 'JU....CR', '09987654321')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 transition-colors shadow-2xs"
            >
              ₱500.00
            </button>
          </div>
        </div>

        {/* Main Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/80 border border-slate-200/80 space-y-5"
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 p-1.5 flex items-center justify-center overflow-hidden shadow-xs">
                <ItemLogo
                  id="gcash"
                  name="GCash"
                  fallbackImage="/assets/gcash.png"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">GCash Express Send</h2>
                <p className="text-[11px] font-semibold text-blue-600">e-Wallet Receipt</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-black tracking-wider uppercase">
              Template
            </span>
          </div>

          {/* Recipient Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Recipient Name</span>
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. BE....GE"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Recipient Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Recipient Number / Account</span>
            </label>
            <input
              type="text"
              required
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
              placeholder="e.g. 101949494949"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-blue-600" />
              <span>Amount (₱)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-base font-bold text-blue-600">
                ₱
              </span>
              <input
                type="text"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1,000,000.00"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Reference Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Reference No. (13 digits)</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateRef}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. 3467040145096"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Date & Time Text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Transaction Date & Time</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomDate(formatGCashDate(new Date()))}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                <span>Set Current Time</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              placeholder="Jul 26, 2026 8:29AM"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#3b5bfd] hover:bg-[#2e4be8] text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Generate Express Send Receipt</span>
          </button>
        </motion.form>
      </div>
    </div>
  );
};
