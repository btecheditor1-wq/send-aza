import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';
import { CashAppReceiptData, formatCashAppAmount } from './CashAppTemplate1Page';

export const CashAppTemplate1GeneratedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Retrieve data from location state or sessionStorage
  const [data, setData] = useState<CashAppReceiptData | null>(() => {
    if (location.state) {
      return location.state as CashAppReceiptData;
    }
    try {
      const stored = sessionStorage.getItem('cashapp_template1_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    if (!data) {
      // Sample fallback
      setData({
        templateId: 'template1',
        recipientName: 'JOHN DOE',
        cashtag: 'johndoe',
        paymentFor: 'Payment for services',
        amount: '150.00',
        date: new Date().toISOString().split('T')[0],
        time: '14:30',
        status: 'Completed',
        refNumber: '#C-98234729',
        paymentMethod: 'Cash Balance',
        notes: 'Thank you for your business!',
        websiteName: 'cash.app',
      });
    }
  }, [data]);

  if (!data) return null;

  // Format date display: e.g. "Jul 26, 2026 at 2:30 PM"
  const formatDateDisplay = (dateStr: string, timeStr: string) => {
    try {
      const d = new Date(`${dateStr}T${timeStr || '12:00'}`);
      if (isNaN(d.getTime())) return `${dateStr} ${timeStr}`;

      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      const month = monthNames[d.getMonth()];
      const day = d.getDate();
      const year = d.getFullYear();

      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  const formattedDateTime = formatDateDisplay(data.date, data.time);
  const formattedAmount = formatCashAppAmount(data.amount);

  const initialLetter = data.recipientName
    ? data.recipientName.trim().charAt(0).toUpperCase()
    : 'C';

  const handleCopyRef = () => {
    if (data.refNumber) {
      navigator.clipboard.writeText(data.refNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);

    try {
      let dataUrl = '';
      try {
        dataUrl = await toPng(receiptRef.current, {
          cacheBust: true,
          pixelRatio: 3,
        });
      } catch {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 3,
          backgroundColor: '#FFFFFF',
          useCORS: true,
        });
        dataUrl = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      link.download = `CashApp_Receipt_${data.recipientName || 'Transaction'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Navigation Actions Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/cashapp/template1.html')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Edit Form</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Ref</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 px-3.5 py-1.5 rounded-full shadow-md shadow-emerald-500/20 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Saving...' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* RECEIPT CANVAS CONTAINER FOR EXPORT */}
        <div className="flex justify-center">
          <div
            ref={receiptRef}
            className="w-full max-w-[400px] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden text-slate-900"
          >
            {/* Header Green Accent Bar */}
            <div className="bg-[#00D632] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white text-[#00D632] rounded-full flex items-center justify-center font-black text-lg shadow-2xs">
                  $
                </div>
                <span className="font-extrabold text-sm tracking-wide">Cash App</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Web Receipt</span>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-5">
              {/* Profile Avatar & Recipient */}
              <div className="text-center space-y-2">
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-full bg-[#00D632] text-white flex items-center justify-center font-black text-2xl shadow-md mx-auto">
                    {initialLetter}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-[#00D632] fill-emerald-50" />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {data.recipientName || 'Recipient Name'}
                  </h2>
                  {data.cashtag && (
                    <p className="text-xs font-semibold text-slate-400">
                      ${data.cashtag.startsWith('$') ? data.cashtag.slice(1) : data.cashtag}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="pt-2">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    ${formattedAmount}
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-50 text-[#00D632] text-xs font-extrabold rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{data.status || 'Completed'}</span>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3.5 text-xs">
                {/* Payment For */}
                {data.paymentFor && (
                  <div className="flex items-start justify-between pb-3 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">For</span>
                    <span className="font-bold text-slate-800 text-right max-w-[200px]">
                      {data.paymentFor}
                    </span>
                  </div>
                )}

                {/* Date & Time */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Date</span>
                  <span className="font-bold text-slate-800">{formattedDateTime}</span>
                </div>

                {/* Payment Method */}
                {data.paymentMethod && (
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">Payment Source</span>
                    <span className="font-bold text-slate-800">{data.paymentMethod}</span>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Status</span>
                  <span className="font-bold text-[#00D632]">{data.status || 'Completed'}</span>
                </div>

                {/* Reference ID */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Identifier</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {data.refNumber}
                  </span>
                </div>

                {/* Notes */}
                {data.notes && (
                  <div className="flex items-start justify-between pb-3 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">Note</span>
                    <span className="font-bold text-slate-800 text-right max-w-[200px]">
                      {data.notes}
                    </span>
                  </div>
                )}

                {/* Website Name */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Website</span>
                  <span className="font-bold text-slate-800">{data.websiteName || 'cash.app'}</span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="text-center pt-2 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Verified by Cash App System</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  https://{data.websiteName || 'cash.app'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
