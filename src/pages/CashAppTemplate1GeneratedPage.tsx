import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Download,
  Edit3,
  Copy,
  Check,
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
      // Sample default fallback matching user example
      setData({
        templateId: 'template1',
        recipientName: 'Benjamin George',
        cashtag: 'ben',
        paymentFor: 'bennie',
        amount: '1000.00',
        date: new Date().toISOString().split('T')[0],
        time: '01:26',
        status: 'Completed',
        refNumber: '#C-98234729',
        paymentMethod: 'Cash Balance',
        notes: 'bennie',
        websiteName: 'cash.app',
      });
    }
  }, [data]);

  if (!data) return null;

  // Format date display: e.g. "Today at 01:26 AM" or "Jul 26 at 01:26 AM"
  const formatDateDisplay = (dateStr: string, timeStr: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      let hours = 1;
      let minutes = '26';
      let ampm = 'AM';

      if (timeStr) {
        const parts = timeStr.split(':');
        let h = parseInt(parts[0], 10);
        minutes = parts[1] || '00';
        ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        hours = h;
      }

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

      if (dateStr === today) {
        return `Today at ${formattedTime}`;
      }

      const d = new Date(`${dateStr}T${timeStr || '12:00'}`);
      if (isNaN(d.getTime())) return `${dateStr} at ${formattedTime}`;

      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      const month = monthNames[d.getMonth()];
      const day = d.getDate();

      return `${month} ${day} at ${formattedTime}`;
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  const formattedDateTime = formatDateDisplay(data.date, data.time);
  const formattedAmount = formatCashAppAmount(data.amount);

  const initialLetter = data.recipientName
    ? data.recipientName.trim().charAt(0).toUpperCase()
    : 'B';

  const cleanCashtag = data.cashtag
    ? (data.cashtag.startsWith('$') ? data.cashtag : `$${data.cashtag}`)
    : '$ben';

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
          backgroundColor: '#ffffff',
        });
      } catch {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 3,
          backgroundColor: '#ffffff',
          useCORS: true,
        });
        dataUrl = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      link.download = `CashApp_Receipt_${data.recipientName.replace(/\s+/g, '_') || 'Transaction'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Status Styles Config
  const statusLower = (data.status || 'completed').toLowerCase();
  const isPending = statusLower.includes('pending');
  const isFailed = statusLower.includes('fail') || statusLower.includes('declin') || statusLower.includes('cancel');
  const isCompleted = !isPending && !isFailed;

  const avatarBg = isCompleted ? '#3498db' : '#00c851';
  const amountColor = isCompleted ? '#000000' : '#888888';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Navigation & Actions Topbar */}
        <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => navigate('/cashapp/template1.html')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Edit</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ref ID</span>
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

        {/* EXACT TEMPLATE 1 CASH APP RECEIPT CANVAS FOR EXPORT */}
        <div className="flex justify-center">
          <div
            ref={receiptRef}
            className="w-full max-w-[400px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-900 flex flex-col items-center px-5 py-12"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
          >
            {/* Avatar Circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-semibold mb-4 shadow-2xs"
              style={{ backgroundColor: avatarBg }}
            >
              {initialLetter}
            </div>

            {/* Recipient Name */}
            <div className="text-[22px] font-semibold text-black mb-1.5 text-center">
              {data.recipientName || 'Benjamin George'}
            </div>

            {/* Subtitle */}
            <div className="text-[16px] text-[#888888] mb-20 text-center">
              Payment to {cleanCashtag}
            </div>

            {/* Amount */}
            <div
              className="text-[48px] font-semibold mb-2 text-center tracking-tight"
              style={{ color: amountColor }}
            >
              ${formattedAmount}
            </div>

            {/* Note (if provided) */}
            {(data.notes || data.paymentFor) && (
              <div className="text-[16px] text-[#888888] mb-1 text-center">
                {data.notes || data.paymentFor}
              </div>
            )}

            {/* Date Time */}
            <div className="text-[16px] text-[#888888] mb-20 text-center">
              {formattedDateTime}
            </div>

            {/* Completed status buttons */}
            {isCompleted && (
              <>
                <div className="w-full max-w-[320px] h-[56px] bg-[#00c851] text-white text-[18px] font-medium rounded-[28px] flex items-center justify-center gap-2 mb-4 shadow-2xs select-none">
                  <span className="text-[22px] font-bold">✓</span>
                  <span>Completed</span>
                </div>
                <button
                  type="button"
                  className="w-full max-w-[320px] h-[56px] bg-white text-[#888888] text-[18px] font-medium border-2 border-[#cccccc] rounded-[28px] flex items-center justify-center cursor-default transition-colors hover:bg-[#f5f5f5]"
                >
                  Web Receipt
                </button>
              </>
            )}

            {/* Pending status button */}
            {isPending && (
              <div className="w-full max-w-[320px] h-[56px] bg-white text-[#888888] text-[18px] font-medium border-2 border-[#cccccc] rounded-[28px] flex items-center justify-center cursor-default">
                Pending
              </div>
            )}

            {/* Failed status button */}
            {isFailed && (
              <div className="w-full max-w-[320px] h-[56px] bg-[#ff0000] text-white text-[18px] font-medium rounded-[28px] flex items-center justify-center cursor-default">
                Failed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

