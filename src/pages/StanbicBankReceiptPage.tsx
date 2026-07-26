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

export const StanbicBankReceiptPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [amount, setAmount] = useState('50000');
  const [senderName, setSenderName] = useState('CHINEDU EZE');
  const [senderAccount, setSenderAccount] = useState('0123456789');
  const [receiverAccount, setReceiverAccount] = useState('0987654321');
  const [receiverName, setReceiverName] = useState('OLUWASEUN ADEBAYO');
  const [receiverBank, setReceiverBank] = useState('GTBank');
  const [narration, setNarration] = useState('Payment for goods');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Bank search/filter state
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let cleanedAmount = amount.replace(/[^0-9.]/g, '');
    if (cleanedAmount) {
      cleanedAmount = `₦${cleanedAmount}`;
    } else {
      cleanedAmount = '₦0.00';
    }

    const refCode = `NXG0000${generateRandomDigits(26)}`;
    const sessionId = generateRandomDigits(30);

    const formData = {
      amount: cleanedAmount,
      senderName,
      senderAccount,
      receiverAccount,
      receiverName,
      receiverBank,
      narration: narration.trim() || 'N/A',
      date,
      time,
      refCode,
      sessionId,
    };

    // Save to sessionStorage for persistence across direct reloads
    try {
      sessionStorage.setItem('stanbic_receipt_data', JSON.stringify(formData));
    } catch {
      // ignore quota or iframe sandbox restrictions
    }

    // Navigate to generated receipt page
    navigate('/nigeria-banks/stanbic/generated', { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 md:py-10">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/nigeria-banks')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Banks
        </button>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center space-y-3"
        >
          {/* Stanbic Bank Logo Centered at Top */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#0033A0] p-3 shadow-lg shadow-blue-900/20 border border-blue-800 flex items-center justify-center overflow-hidden">
              <ItemLogo
                id="stanbic"
                name="Stanbic IBTC"
                fallbackImage="/assets/stanbic.png"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Stanbic IBTC Receipt Generator
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Fill in the transaction details below.
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
          {/* Stanbic Bank Form Header Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0033A0] border border-blue-900 p-1.5 flex items-center justify-center overflow-hidden shadow-xs">
                <ItemLogo
                  id="stanbic"
                  name="Stanbic IBTC"
                  fallbackImage="/assets/stanbic.png"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">Stanbic IBTC Bank</h2>
                <p className="text-[11px] font-semibold text-blue-600">Mobile Transfer Receipt Form</p>
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
                placeholder="e.g. 50000"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Sender Name & Sender Account Grid */}
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
                placeholder="Full name of sender"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Sender Account No.</span>
              </label>
              <input
                type="text"
                required
                value={senderAccount}
                onChange={(e) => setSenderAccount(e.target.value)}
                placeholder="Sender 10-digit account"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Receiver Account & Name Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Beneficiary Account No.</span>
              </label>
              <input
                type="text"
                required
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value)}
                placeholder="10-digit account number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Beneficiary Name</span>
              </label>
              <input
                type="text"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Full name of recipient"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Receiver Bank Searchable Select */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Beneficiary Bank</span>
            </label>

            <div
              onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
            >
              <span>{receiverBank || 'Select Bank'}</span>
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            {/* Dropdown menu */}
            {isBankDropdownOpen && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100 bg-slate-50">
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search bank..."
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
                          setReceiverBank(b);
                          setIsBankDropdownOpen(false);
                          setBankSearch('');
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                          receiverBank === b ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-400 text-center font-medium">
                      No bank found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Narration */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Narration / Remarks</span>
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g. Payment for items"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
            />
          </div>

          {/* Date and Time Grid */}
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

          {/* Automatic ID info box */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-2xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-900/80 font-medium leading-relaxed">
              <strong>Auto-Generated Fields:</strong> Transaction Reference (<code className="bg-white px-1 py-0.5 rounded text-[11px] font-mono text-blue-800">NXG0000...</code> + 26 digits) and Session ID (30 digits) are created automatically on every receipt submission.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 bg-[#0033A0] hover:bg-blue-800 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-900/25 flex items-center justify-center gap-2 cursor-pointer transition-all mt-6"
          >
            <span>Generate Stanbic Receipt</span>
            <CheckCircle2 className="w-5 h-5" />
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
};
