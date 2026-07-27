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
  CheckCircle,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';
import { CashAppReceiptData, formatCashAppAmount } from './CashAppTemplate1Page';

export const CashAppTemplate2GeneratedPage: React.FC = () => {
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
      const stored = sessionStorage.getItem('cashapp_template2_data');
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
        templateId: 'template2',
        recipientName: 'JANE SMITH',
        cashtag: 'janesmith',
        paymentFor: 'Graphic Design Work',
        amount: '250.00',
        date: new Date().toISOString().split('T')[0],
        time: '16:15',
        status: 'Completed',
        refNumber: 'CAS-8912349012',
        paymentMethod: 'Visa Debit Card (...9921)',
        notes: 'Instant payment received',
        websiteName: 'cash.app',
      });
    }
  }, [data]);

  if (!data) return null;

  // Format date display: e.g. "Jul 26, 2026, 4:15 PM"
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

      return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
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
      link.download = `CashApp_Template2_${data.recipientName || 'Receipt'}.png`;
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
            onClick={() => navigate('/cashapp/template2.html')}
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
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-full shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
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
            className="w-full max-w-[400px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white"
          >
            {/* Green Header Banner */}
            <div className="bg-gradient-to-br from-[#00D632] to-[#00B028] pt-7 pb-12 px-6 text-center relative overflow-hidden">
              {/* Subtle background circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 bg-black/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Payment Confirmation</span>
              </div>

              <h2 className="text-sm font-semibold text-emerald-50">
                Payment To {data.recipientName || 'Recipient'}
              </h2>
              <div className="text-4xl font-black text-white tracking-tight mt-1">
                ${formattedAmount}
              </div>
            </div>

            {/* Overlapping Receipt Card */}
            <div className="-mt-6 mx-4 mb-6 bg-white rounded-2xl p-5 text-slate-900 shadow-xl border border-slate-100 space-y-4">
              {/* Profile Bar */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-11 h-11 rounded-full bg-[#00D632] text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {initialLetter}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-slate-900 text-sm truncate">
                    {data.recipientName || 'Recipient Name'}
                  </h3>
                  {data.cashtag && (
                    <p className="text-xs font-semibold text-slate-400 truncate">
                      ${data.cashtag.startsWith('$') ? data.cashtag.slice(1) : data.cashtag}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                  <span>{data.status || 'Completed'}</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-3 text-xs">
                {data.paymentFor && (
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-slate-400">For</span>
                    <span className="font-bold text-slate-800 text-right max-w-[200px]">
                      {data.paymentFor}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Date & Time</span>
                  <span className="font-bold text-slate-800">{formattedDateTime}</span>
                </div>

                {data.paymentMethod && (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">Payment Method</span>
                    <span className="font-bold text-slate-800">{data.paymentMethod}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Ref Number</span>
                  <span className="font-bold text-slate-800 font-mono">{data.refNumber}</span>
                </div>

                {data.notes && (
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-slate-400">Notes</span>
                    <span className="font-bold text-slate-800 text-right max-w-[200px]">
                      {data.notes}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-400">Website</span>
                  <span className="font-bold text-emerald-600">{data.websiteName || 'cash.app'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Official Cash App Receipt • {data.websiteName || 'cash.app'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
