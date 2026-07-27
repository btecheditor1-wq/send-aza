import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export interface CashAppReceiptData {
  templateId: 'template1' | 'template2';
  recipientName: string;
  cashtag: string;
  paymentFor: string;
  amount: string;
  date: string;
  time: string;
  status: string;
  refNumber: string;
  paymentMethod: string;
  notes: string;
  websiteName: string;
}

export const formatCashAppAmount = (rawAmount: string): string => {
  if (!rawAmount || !rawAmount.trim()) return '0.00';
  const cleaned = rawAmount.replace(/[^0-9.]/g, '');
  if (!cleaned) return '0.00';

  if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    const intVal = parts[0] ? Number(parts[0]).toLocaleString('en-US') : '0';
    let decPart = parts[1] || '00';
    if (decPart.length === 1) decPart += '0';
    else if (decPart.length > 2) decPart = decPart.slice(0, 2);
    return `${intVal}.${decPart}`;
  } else {
    const intVal = Number(cleaned).toLocaleString('en-US');
    return `${intVal}.00`;
  }
};

export const CashAppTemplate1Page: React.FC = () => {
  const navigate = useNavigate();

  // All form fields start EMPTY as requested by the user
  const [recipientName, setRecipientName] = useState('');
  const [cashtag, setCashtag] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [status, setStatus] = useState('Completed');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedAmount = formatCashAppAmount(amount);

    const formData: CashAppReceiptData = {
      templateId: 'template1',
      recipientName: recipientName.trim(),
      cashtag: cashtag.trim(),
      paymentFor: '',
      amount: formattedAmount,
      date,
      time,
      status: status.trim() || 'Completed',
      refNumber: `#C-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentMethod: '',
      notes: notes.trim(),
      websiteName: 'cash.app',
    };

    sessionStorage.setItem('cashapp_template1_data', JSON.stringify(formData));
    navigate('/cashapp/template1/generated', { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-6">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/cashapp')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Select Template</span>
          </button>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Template 1 Form
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2 text-center"
        >
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-sm">
            $
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Cash App Receipt Generator
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Template 1 — Fill in transaction details below
          </p>
        </motion.div>

        {/* Receipt Generator Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
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
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Note: Entering <code className="text-emerald-600 font-semibold">100</code> auto-formats to <code className="text-emerald-600 font-semibold">100.00</code>.
              </p>
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
                  placeholder="e.g. John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* $Cashtag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                $Cashtag
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  $
                </span>
                <input
                  type="text"
                  placeholder="e.g. johndoe"
                  value={cashtag}
                  onChange={(e) => setCashtag(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Thank you for your payment!"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-base shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Receipt</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};
