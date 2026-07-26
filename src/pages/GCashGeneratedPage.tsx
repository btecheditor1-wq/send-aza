import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Download,
  Edit3,
  Copy,
  Check,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';

interface GCashReceiptData {
  recipientName: string;
  recipientNumber: string;
  amount: string;
  refNumber: string;
  customDate: string;
  carbonText: string;
}

export const GCashGeneratedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneFrameRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Retrieve data from state or sessionStorage
  const getInitialData = (): GCashReceiptData => {
    if (location.state?.formData) {
      return location.state.formData;
    }
    const saved = sessionStorage.getItem('gcash_receipt_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse GCash receipt data', e);
      }
    }
    return {
      recipientName: 'BE....GE',
      recipientNumber: '101949494949',
      amount: '1,000,000.00',
      refNumber: '3467040145096',
      customDate: 'Jul 26, 2026 8:29AM',
      carbonText: '131g (gCO2e)',
    };
  };

  const receiptData = getInitialData();

  // Clean and format total amount with ₱
  let rawAmount = receiptData.amount.trim();
  let totalAmountStr = rawAmount;
  if (!totalAmountStr.startsWith('₱')) {
    totalAmountStr = `₱${totalAmountStr}`;
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(receiptData.refNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleDownload = async () => {
    if (!phoneFrameRef.current) return;
    setIsDownloading(true);

    const styleElements = Array.from(document.querySelectorAll('style'));
    const originalTexts = styleElements.map((s) => s.textContent);

    try {
      styleElements.forEach((s) => {
        if (s.textContent && (s.textContent.includes('oklab') || s.textContent.includes('oklch'))) {
          s.textContent = s.textContent
            .replace(/oklab\([^)]+\)/g, 'transparent')
            .replace(/oklch\([^)]+\)/g, 'transparent');
        }
      });

      const fileName = `gcash-express-send-${receiptData.refNumber}.png`;

      try {
        const canvas = await html2canvas(phoneFrameRef.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#3b5bfd',
          logging: false,
          scrollX: 0,
          scrollY: 0,
        });
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (h2cErr) {
        console.warn('html2canvas error, using toPng fallback:', h2cErr);
        const dataUrl = await toPng(phoneFrameRef.current, {
          quality: 1.0,
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: '#3b5bfd',
          style: { transform: 'none' },
        });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Failed to download image', err);
      alert('Could not generate receipt image. Please try taking a screenshot.');
    } finally {
      styleElements.forEach((s, idx) => {
        if (originalTexts[idx] !== null) {
          s.textContent = originalTexts[idx];
        }
      });
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16">
      <Navbar showBack={true} />

      <div className="max-w-xl mx-auto px-2 sm:px-4 pt-4 sm:pt-6 space-y-5">
        {/* Action Controls Header */}
        <div className="flex items-center justify-between bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md shadow-xl">
          <button
            onClick={() => navigate('/gcash/receipt')}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Edit3 className="w-4 h-4 text-blue-400" />
            <span>Edit Details</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRef}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedRef ? 'Copied!' : 'Copy Ref'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-extrabold text-white shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Saving...' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* Receipt Display Wrapper */}
        <div className="w-full flex justify-center py-2 px-0 sm:px-1">
          {/* PHONE FRAME (Exact 375px template scaled for full screen mobile) */}
          <div
            ref={phoneFrameRef}
            id="gcash-receipt-card"
            className="w-full max-w-[375px] bg-[#3b5bfd] relative overflow-hidden shrink-0 shadow-2xl rounded-2xl sm:rounded-3xl select-none text-left"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            {/* ===== HEADER ===== */}
            <div className="h-[150px] sm:h-[180px] px-4 flex items-center justify-center relative">
              <span className="text-white text-[15px] sm:text-[17px] font-semibold tracking-[0.2px]">
                Express Send
              </span>
              <button
                type="button"
                onClick={() => navigate('/gcash/receipt')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-white text-[22px] font-light cursor-pointer w-7 h-7 flex items-center justify-center leading-none"
              >
                &times;
              </button>
            </div>

            {/* ===== WHITE CARD ===== */}
            <div
              className="bg-white rounded-t-[16px] m-0 relative min-h-[calc(100%-150px)] sm:min-h-[calc(812px-180px)] pb-6"
            >
              {/* ===== CHECK ICON ===== */}
              <div className="flex justify-center -mt-[26px] relative z-10">
                <div
                  className="w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] bg-[#3b5bfd] rounded-full flex items-center justify-center border-4 border-white"
                  style={{
                    boxShadow: '0 2px 16px rgba(59, 91, 253, 0.25)',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              {/* ===== RECIPIENT INFO ===== */}
              <div className="text-center pt-[16px] px-[20px] pb-0">
                <div className="text-[16px] sm:text-[18px] font-bold text-[#1a2b4a] mb-[8px] tracking-[0.3px]">
                  {receiptData.recipientName}
                </div>
                <div className="inline-block bg-[#f0f2f8] rounded-[20px] px-[14px] py-[4px] sm:py-[6px] mb-[6px]">
                  <span className="text-[13.5px] sm:text-[15px] font-semibold text-[#4a5568] tracking-[0.4px]">
                    {receiptData.recipientNumber}
                  </span>
                </div>
                <div className="text-[11px] sm:text-[12px] text-[#a0aec0] mt-[2px] font-normal">
                  Sent via GCash
                </div>
              </div>

              {/* ===== DIVIDER 1 ===== */}
              <div className="border-t border-[#e8ecf4] mt-[32px] mx-[16px] mb-0" />

              {/* ===== AMOUNT ROW ===== */}
              <div className="flex justify-between items-center pt-[20px] px-[16px] pb-[14px]">
                <span className="text-[13px] sm:text-[14px] font-medium text-[#2d3748]">
                  Amount
                </span>
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#1a202c]">
                  {rawAmount.replace(/^₱/, '')}
                </span>
              </div>

              {/* ===== DIVIDER 2 ===== */}
              <div className="border-t border-[#d1d5db] mx-[16px] my-0" />

              {/* ===== TOTAL ROW ===== */}
              <div className="flex justify-between items-center pt-[16px] px-[16px] pb-[16px]">
                <span className="text-[13px] sm:text-[14px] font-semibold text-[#2d3748]">
                  Total Amount Sent
                </span>
                <span className="text-[18px] sm:text-[20px] font-bold text-[#1a202c]">
                  {totalAmountStr}
                </span>
              </div>

              {/* ===== REF ROW - TALL GRAY BACKGROUND ===== */}
              <div className="bg-[#f4f6fa] m-0 px-[16px] py-[20px] flex justify-between items-start min-h-[120px]">
                <div className="flex items-center gap-[2px]">
                  <span className="text-[10px] sm:text-[11px] text-[#718096] font-normal">
                    Ref No.&nbsp;
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#4a5568] font-medium">
                    {receiptData.refNumber}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#4a5568] font-medium">
                  {receiptData.customDate}
                </span>
              </div>

              {/* ===== CARBON CARD ===== */}
              <div
                className="mt-[20px] mx-[16px] mb-0 rounded-[12px] px-[14px] py-[12px]"
                style={{
                  background:
                    'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
                }}
              >
                <div className="text-[12px] sm:text-[13px] font-bold text-[#065f46] mb-[4px]">
                  {receiptData.carbonText}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#047857] leading-[1.4] font-normal">
                  By going digital, you reduce your carbon footprint from
                  transportation, paper, and plasti...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/gcash/receipt')}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Create Another Receipt</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Save Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
