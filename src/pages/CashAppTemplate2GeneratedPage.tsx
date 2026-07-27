import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Edit3,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';
import { CashAppReceiptData } from './CashAppTemplate1Page';

const formatTemplate2Amount = (raw: string): string => {
  if (!raw || !raw.trim()) return '1,500';
  let cleaned = raw.trim();
  if (cleaned.startsWith('$')) {
    cleaned = cleaned.substring(1).trim();
  }
  const numOnly = cleaned.replace(/,/g, '');
  if (isNaN(Number(numOnly))) return cleaned;

  if (numOnly.includes('.')) {
    const parts = numOnly.split('.');
    const integerPart = Number(parts[0]).toLocaleString('en-US');
    const decimalPart = parts[1];
    if (decimalPart === '00' || decimalPart === '0' || !decimalPart) {
      return integerPart;
    }
    return `${integerPart}.${decimalPart}`;
  }
  return Number(numOnly).toLocaleString('en-US');
};

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
      setData({
        templateId: 'template2',
        recipientName: 'Anthony Tenebruso',
        cashtag: '',
        paymentFor: '',
        amount: '1,500',
        date: new Date().toISOString().split('T')[0],
        time: '10:01',
        status: 'Completed',
        refNumber: '',
        paymentMethod: '',
        notes: '',
        websiteName: 'cash.app',
      });
    }
  }, [data]);

  if (!data) return null;

  const displayAmount = formatTemplate2Amount(data.amount);
  const recipientName = data.recipientName || 'Anthony Tenebruso';
  const displayTime = data.time || '10:01';

  const handleCopyText = () => {
    const text = `Sent! $${displayAmount} will be deposited once ${recipientName} completes the payment.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      link.download = `CashApp_Sent_${recipientName.replace(/\s+/g, '_')}.png`;
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Edit Form</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text</span>
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
            className="w-full max-w-[390px] min-h-[640px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-900 flex flex-col justify-between relative"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 pt-3 h-[44px]">
              <span className="text-[17px] font-semibold text-black tracking-[-0.3px]">
                {displayTime}
              </span>
              <div className="flex items-center gap-[6px]">
                {/* Signal Bars */}
                <div className="flex items-end gap-[2px] h-[14px]">
                  <div className="w-[3px] h-[4px] bg-black rounded-[0.5px]" />
                  <div className="w-[3px] h-[7px] bg-black rounded-[0.5px]" />
                  <div className="w-[3px] h-[10px] bg-black rounded-[0.5px]" />
                  <div className="w-[3px] h-[13px] bg-black rounded-[0.5px]" />
                </div>
                <span className="text-[12px] font-semibold text-black ml-[2px]">
                  5G
                </span>
                {/* Battery Icon */}
                <div className="w-[25px] h-[12px] border-[1.2px] border-black rounded-[3px] relative flex items-center p-[1.5px]">
                  <div className="w-[60%] h-full bg-black rounded-[1px]" />
                  <div className="w-[1.5px] h-[5px] bg-black absolute -right-[3px] rounded-r-[1px]" />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-start px-8 pt-10 pb-6">
              {/* Check Circle */}
              <div className="w-[56px] h-[56px] bg-[#00D632] rounded-full flex items-center justify-center mb-6 shadow-2xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[28px] h-[28px]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              {/* Message */}
              <p className="m-0 text-[28px] font-semibold text-[#1a1a1a] leading-[1.25] tracking-[-0.4px]">
                Sent! ${displayAmount} will be deposited once {recipientName} completes the payment.
              </p>
            </div>

            {/* Bottom Section */}
            <div className="px-6 pb-2">
              <button
                type="button"
                className="w-full h-[54px] bg-[#00D632] text-white text-[17px] font-semibold rounded-[27px] flex items-center justify-center cursor-pointer outline-none tracking-[-0.2px] mb-4 active:opacity-90 transition-opacity"
              >
                Done
              </button>

              {/* Home Indicator */}
              <div className="flex justify-center pb-2">
                <div className="w-[134px] h-[5px] bg-black rounded-[2.5px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
