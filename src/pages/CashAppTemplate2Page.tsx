import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CashAppReceiptData } from './CashAppTemplate1Page';

export const CashAppTemplate2Page: React.FC = () => {
  const navigate = useNavigate();

  // All form fields start EMPTY except time which defaults to current time (e.g. 10:01)
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    hours = hours % 12 || 12;
    return `${hours}:${minutes}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: CashAppReceiptData = {
      templateId: 'template2',
      recipientName: recipientName.trim(),
      cashtag: '',
      paymentFor: '',
      amount: amount.trim(),
      date: new Date().toISOString().split('T')[0],
      time: time.trim() || '10:01',
      status: 'Completed',
      refNumber: '',
      paymentMethod: '',
      notes: '',
      websiteName: 'cash.app',
    };

    sessionStorage.setItem('cashapp_template2_data', JSON.stringify(formData));
    navigate('/cashapp/template2/generated', { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-6">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/cashapp')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Select Template</span>
          </button>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Template 2 Form
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2 text-center"
        >
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-sm">
            $
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Cash App Receipt Generator
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Template 2 — Payment Sent Confirmation
          </p>
        </motion.div>

        {/* Receipt Generator Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            {/* Time Field (Shows at top status bar) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Time (Status Bar)
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 10:01"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Recipient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Recipient Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Anthony Tenebruso"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  $
                </span>
                <input
                  type="text"
                  placeholder="e.g. 1,500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Receipt</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};
