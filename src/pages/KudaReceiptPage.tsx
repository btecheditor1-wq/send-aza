import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  Shuffle,
  CreditCard,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export interface KudaReceiptData {
  amount: string;
  beneficiaryName: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  senderName: string;
  senderBank: string;
  senderAccount: string;
  paidDate: string;
  paidTime: string;
  fees: string;
  vat: string;
  description: string;
  transRef: string;
  paymentType: string;
}

export const KudaReceiptPage: React.FC = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState('200.00');
  const [beneficiaryName, setBeneficiaryName] = useState('BENJAMIN CHIKUKA GEORGE');
  const [beneficiaryBank, setBeneficiaryBank] = useState('Opay Digital Services Limited');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('8062827392');
  const [senderName, setSenderName] = useState('GEORGE, CHIKUKA BENJAMIN');
  const [senderBank, setSenderBank] = useState('Kuda');
  const [senderAccount, setSenderAccount] = useState('2084860642');
  const [paidDate, setPaidDate] = useState('July 28, 2026');
  const [paidTime, setPaidTime] = useState('07:54 AM');
  const [fees, setFees] = useState('0.0');
  const [vat, setVat] = useState('0.0');
  const [description, setDescription] = useState('BigBen');
  const [transRef, setTransRef] = useState('090267260728065443364084860642');
  const [paymentType, setPaymentType] = useState('Outward Transfer');

  const generateRandomRef = () => {
    let result = '09';
    for (let i = 0; i < 28; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    setTransRef(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: KudaReceiptData = {
      amount: amount.trim(),
      beneficiaryName: beneficiaryName.trim(),
      beneficiaryBank: beneficiaryBank.trim(),
      beneficiaryAccount: beneficiaryAccount.trim(),
      senderName: senderName.trim(),
      senderBank: senderBank.trim(),
      senderAccount: senderAccount.trim(),
      paidDate: paidDate.trim(),
      paidTime: paidTime.trim(),
      fees: fees.trim(),
      vat: vat.trim(),
      description: description.trim(),
      transRef: transRef.trim(),
      paymentType: paymentType.trim(),
    };

    sessionStorage.setItem('kuda_receipt_data', JSON.stringify(formData));
    navigate('/nigeria-banks/kuda/generated', { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <Navbar showBack={true} />

      <div className="max-w-xl mx-auto px-4 pt-4 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/nigeria-banks')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Select Bank</span>
          </button>
          <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1.5">
            <img src="/kuda.png" alt="Kuda" className="h-3.5 width-auto object-contain" />
            Kuda MFB
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-center"
        >
          <div className="w-14 h-14 bg-purple-50 rounded-2xl mx-auto flex items-center justify-center p-2 border border-purple-100 shadow-2xs">
            <img src="/kuda.png" alt="Kuda Logo" className="w-full h-auto object-contain" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Kuda Bank Receipt Generator
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Fill in the details below to generate an official Kuda Microfinance Bank transaction receipt.
          </p>
        </motion.div>

        {/* Receipt Generator Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-purple-600" />
              <span>Transaction Amount</span>
            </h2>

            {/* Amount Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Transaction Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  ₦
                </span>
                <input
                  type="text"
                  placeholder="e.g. 200.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Beneficiary Details Section */}
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>Beneficiary Details</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BENJAMIN CHIKUKA GEORGE"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Beneficiary Bank
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opay Digital Services Limited"
                    value={beneficiaryBank}
                    onChange={(e) => setBeneficiaryBank(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Beneficiary Account No. / Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8062827392"
                    value={beneficiaryAccount}
                    onChange={(e) => setBeneficiaryAccount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sender Details Section */}
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Sender Details</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. GEORGE, CHIKUKA BENJAMIN"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sender Bank
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kuda"
                    value={senderBank}
                    onChange={(e) => setSenderBank(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sender Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2084860642"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Meta Details */}
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Transaction Metadata</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Paid On (Date)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. July 28, 2026"
                    value={paidDate}
                    onChange={(e) => setPaidDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Paid On (Time)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. 07:54 AM"
                    value={paidTime}
                    onChange={(e) => setPaidTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Fees (₦)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0.0"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  VAT (₦)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0.0"
                  value={vat}
                  onChange={(e) => setVat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. BigBen"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Outward Transfer"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Transaction Reference
                </label>
                <button
                  type="button"
                  onClick={generateRandomRef}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-700"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Random</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. 090267260728065443364084860642"
                value={transRef}
                onChange={(e) => setTransRef(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-extrabold text-base shadow-lg shadow-purple-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Kuda Receipt</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};
