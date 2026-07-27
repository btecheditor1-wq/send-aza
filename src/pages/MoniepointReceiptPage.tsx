import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Building2,
  User,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Search,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ALL_NIGERIAN_BANKS } from '../data/appData';
import { ItemLogo } from '../components/ItemLogo';

export const MoniepointReceiptPage: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [amount, setAmount] = useState('');
  const [senderName, setSenderName] = useState('');
  const [sourceInstitution, setSourceInstitution] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [beneficiaryInstitution, setBeneficiaryInstitution] = useState('');
  const [transactionType, setTransactionType] = useState('Transfer');
  const [transactionStatus, setTransactionStatus] = useState('Successful');
  const [narration, setNarration] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Bank search states
  const [bankSearch, setBankSearch] = useState('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

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

  const generateTransRef = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rand = '';
    for (let i = 0; i < 9; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TRF|${rand}|207${generateRandomDigits(16)}`;
  };

  const generateProviderRef = (): string => {
    return `09040${generateRandomDigits(25)}`;
  };

  const formatMoniepointAmount = (rawAmount: string): string => {
    if (!rawAmount || !rawAmount.trim()) return '0.00';
    const cleaned = rawAmount.replace(/[^0-9.]/g, '');
    if (!cleaned) return '0.00';

    if (cleaned.includes('.')) {
      const parts = cleaned.split('.');
      const intVal = parts[0] ? parts[0] : '0';
      let decPart = parts[1] || '00';
      if (decPart.length === 1) decPart += '0';
      else if (decPart.length > 2) decPart = decPart.slice(0, 2);
      return `${intVal}.${decPart}`;
    } else {
      return `${cleaned}.00`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedAmt = formatMoniepointAmount(amount);

    const formData = {
      amount: formattedAmt,
      senderName: senderName.trim() || 'SENDER NAME',
      sourceInstitution: sourceInstitution.trim() || 'MONIEPOINT',
      beneficiaryName: beneficiaryName.trim() || 'BENEFICIARY NAME',
      beneficiaryAccount: beneficiaryAccount.trim() || '0000000000',
      beneficiaryInstitution: beneficiaryInstitution.trim() || 'MOMO PSB',
      transactionType,
      transactionStatus,
      narration: narration.trim(),
      date,
      time,
      transRef: generateTransRef(),
      providerRef: generateProviderRef(),
    };

    try {
      sessionStorage.setItem('moniepoint_receipt_data', JSON.stringify(formData));
    } catch {
      // ignore
    }

    navigate('/nigeria-banks/moniepoint/generated', { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 md:py-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/nigeria-banks')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Banks
        </button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center space-y-3"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-white p-3 shadow-xl shadow-blue-600/10 border border-slate-200/80 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/moniepoint.png"
                alt="Moniepoint Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/moniepoint.png';
                }}
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Moniepoint MFB Receipt Generator
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Fill in the details below to generate a Moniepoint transfer receipt.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/80 border border-slate-200/80 space-y-5"
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center overflow-hidden shadow-xs border border-slate-200">
                <img
                  src="/assets/moniepoint.png"
                  alt="Moniepoint"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/moniepoint.png';
                  }}
                />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">Moniepoint Microfinance Bank</h2>
                <p className="text-[11px] font-semibold text-blue-600">Official Transfer Receipt Form</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-black tracking-wider uppercase">
              Official
            </span>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Amount (₦)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                ₦
              </span>
              <input
                type="text"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 190.00"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Sender Name & Source Institution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Sender Name</span>
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Sender full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Source Institution</span>
              </label>
              <input
                type="text"
                required
                value={sourceInstitution}
                onChange={(e) => setSourceInstitution(e.target.value)}
                placeholder="e.g. MONIEPOINT"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Beneficiary Name & Beneficiary Phone/Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Beneficiary Name</span>
              </label>
              <input
                type="text"
                required
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="Recipient full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Beneficiary Phone / Account No.</span>
              </label>
              <input
                type="text"
                required
                value={beneficiaryAccount}
                onChange={(e) => setBeneficiaryAccount(e.target.value)}
                placeholder="Phone or 10-digit account"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Beneficiary Bank Select */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Beneficiary Institution</span>
            </label>

            <div
              onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
            >
              <span>{beneficiaryInstitution || 'Select Institution'}</span>
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            {isBankDropdownOpen && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100 bg-slate-50">
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search bank or PSB..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                    autoFocus
                  />
                </div>

                <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setBeneficiaryInstitution(b);
                          setIsBankDropdownOpen(false);
                          setBankSearch('');
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                          beneficiaryInstitution === b ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-400 text-center font-medium">
                      No institution found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Transaction Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Transaction Time</span>
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Auto generated reference note */}
          <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-900 font-medium leading-relaxed">
              <strong>Auto-Generated References:</strong> Transaction Reference (<code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono text-blue-800">TRF|2MPT...</code>) and Provider Reference (30-digit string) will be calculated automatically upon submission.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 bg-[#005AE8] hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all mt-6"
          >
            <span>Generate Moniepoint Receipt</span>
            <CheckCircle2 className="w-5 h-5" />
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
};
