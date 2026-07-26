import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Download,
  Share2,
  Check,
  Edit3,
  ArrowLeft,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';

interface ReceiptData {
  amount: string;
  senderName: string;
  senderAccount?: string;
  receiverAccount: string;
  receiverName: string;
  receiverBank: string;
  narration: string;
  date: string;
  time: string;
  refCode?: string;
  sessionId?: string;
}

const generateRandomDigits = (count: number): string => {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

export const StanbicBankGeneratedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Retrieve form data from location state or sessionStorage fallback
  const getInitialData = (): ReceiptData => {
    if (location.state) {
      return location.state as ReceiptData;
    }
    try {
      const saved = sessionStorage.getItem('stanbic_receipt_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      amount: '50000',
      senderName: 'CHINEDU EZE',
      senderAccount: '0123456789',
      receiverAccount: '0987654321',
      receiverName: 'OLUWASEUN ADEBAYO',
      receiverBank: 'GTBank',
      narration: 'Payment for goods',
      date: '2026-07-25',
      time: '14:30',
      refCode: `NXG0000${generateRandomDigits(26)}`,
      sessionId: generateRandomDigits(30),
    };
  };

  const receiptData = getInitialData();

  // Helper formatting for exact Stanbic layout
  const formatNGNAmount = (rawAmount: string) => {
    const num = parseFloat(rawAmount.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 'NGN 0.00';
    return `NGN ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTransDate = (rawDate: string) => {
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return rawDate;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return rawDate;
    }
  };

  const formatFullDateTime = (rawDate: string, timeStr: string) => {
    try {
      const d = new Date(`${rawDate}T${timeStr || '00:00'}`);
      if (isNaN(d.getTime())) return `${rawDate}, ${timeStr}`;
      const datePart = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      return `${datePart}, ${timeStr}`;
    } catch {
      return `${rawDate}, ${timeStr}`;
    }
  };

  const amountDisplay = formatNGNAmount(receiptData.amount || '0');
  const transDateDisplay = formatTransDate(receiptData.date);
  const dateTimeDisplay = formatFullDateTime(receiptData.date, receiptData.time);

  const refCode = receiptData.refCode || `NXG0000${generateRandomDigits(26)}`;

  // Download receipt as PNG using html2canvas with isolated element clone
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);

    try {
      const fileName = `Stanbic_Receipt_${refCode.slice(-8)}.png`;

      const styleElements = Array.from(document.querySelectorAll('style'));
      const originalTexts = styleElements.map((s) => s.textContent);

      styleElements.forEach((s) => {
        if (s.textContent && (s.textContent.includes('oklab') || s.textContent.includes('oklch'))) {
          s.textContent = s.textContent
            .replace(/oklab\([^)]+\)/g, 'transparent')
            .replace(/oklch\([^)]+\)/g, 'transparent');
        }
      });

      let dataUrl = '';

      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            const clonedCard = clonedDoc.querySelector('#stanbic-receipt-card') || clonedDoc.body.firstElementChild;
            if (clonedCard && clonedCard instanceof HTMLElement) {
              clonedDoc.body.innerHTML = '';
              clonedDoc.body.appendChild(clonedCard);
              clonedDoc.body.style.margin = '0';
              clonedDoc.body.style.padding = '0';
              clonedDoc.body.style.backgroundColor = '#FFFFFF';

              clonedCard.style.position = 'relative';
              clonedCard.style.top = '0';
              clonedCard.style.left = '0';
              clonedCard.style.margin = '0 auto';
              clonedCard.style.transform = 'none';
              clonedCard.style.boxShadow = 'none';
            }
          },
        });
        dataUrl = canvas.toDataURL('image/png', 1.0);
      } catch (h2cErr) {
        console.warn('html2canvas error, using toPng fallback:', h2cErr);
        dataUrl = await toPng(receiptRef.current, {
          quality: 1.0,
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: '#FFFFFF',
          style: { transform: 'none' },
        });
      } finally {
        styleElements.forEach((s, idx) => {
          if (originalTexts[idx] !== null) {
            s.textContent = originalTexts[idx];
          }
        });
      }

      if (dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Failed to download receipt image:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Copy shareable summary
  const handleShare = () => {
    const summary = `Stanbic IBTC Online Transaction Receipt\nAmount: ${amountDisplay}\nBeneficiary: ${receiptData.receiverName} (${receiptData.receiverAccount} - ${receiptData.receiverBank})\nSender: ${receiptData.senderName} (${receiptData.senderAccount || '0123456789'})\nDate: ${dateTimeDisplay}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col font-['Segoe_UI',_Arial,_sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 md:py-10 flex flex-col items-center">
        {/* Navigation bar */}
        <div className="w-full flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/nigeria-banks/stanbic/receipt')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Edit Form
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/nigeria-banks/stanbic/receipt')}
              className="px-3 py-1.5 bg-[#1c2c8c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-white" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* EXACT STANBIC RECEIPT TEMPLATE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full flex justify-center"
        >
          <div
            ref={receiptRef}
            id="stanbic-receipt-card"
            className="w-full max-w-[420px] bg-white text-[#000] p-4 box-border shadow-md rounded-sm"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#ffffff',
              padding: '14px 16px',
              boxSizing: 'border-box',
              fontFamily: '"Segoe UI", Arial, sans-serif',
            }}
          >
            {/* LOGO */}
            <div className="logo" style={{ textAlign: 'right' }}>
              <img
                src="/assets/logo.png"
                alt="Stanbic Logo"
                style={{ width: '58px', display: 'inline-block' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/logo.png';
                }}
              />
            </div>

            {/* TITLE & DATE */}
            <h3 style={{ margin: '4px 0 2px', fontSize: '15px', fontWeight: 600, color: '#000000' }}>
              Online Transaction Receipt
            </h3>
            <div className="date" style={{ fontSize: '11px', color: '#666666', marginBottom: '6px' }}>
              {dateTimeDisplay}
            </div>

            {/* DIVIDER */}
            <div className="divider" style={{ borderBottom: '2px solid #2e3aa1', margin: '6px 0' }}></div>

            {/* ROW 1: TRANSACTION */}
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11.5px', margin: '2px 0' }}>
              <div className="label" style={{ color: '#222222' }}>TRANSACTION</div>
              <div className="value" style={{ textAlign: 'right', fontWeight: 500, color: '#000000' }}>
                <div id="amount" style={{ marginBottom: '1px' }}>{amountDisplay}</div>
                <div style={{ marginBottom: '1px' }}>ONE OFF PAYMENT</div>
                <div id="transDate">{transDateDisplay}</div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="divider" style={{ borderBottom: '2px solid #2e3aa1', margin: '6px 0' }}></div>

            {/* ROW 2: BENEFICIARY */}
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11.5px', margin: '2px 0' }}>
              <div className="label" style={{ color: '#222222' }}>BENEFICIARY</div>
              <div className="value" style={{ textAlign: 'right', fontWeight: 500, color: '#000000' }}>
                <div id="beneficiary" style={{ marginBottom: '1px' }}>{receiptData.receiverName}</div>
                <div id="beneficiaryAcc" style={{ marginBottom: '1px' }}>{receiptData.receiverAccount}</div>
                <div id="beneficiaryBank">{receiptData.receiverBank}</div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="divider" style={{ borderBottom: '2px solid #2e3aa1', margin: '6px 0' }}></div>

            {/* ROW 3: SENDER */}
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11.5px', margin: '2px 0' }}>
              <div className="label" style={{ color: '#222222' }}>SENDER</div>
              <div className="value" style={{ textAlign: 'right', fontWeight: 500, color: '#000000' }}>
                <div id="sender" style={{ marginBottom: '1px' }}>{receiptData.senderName}</div>
                <div id="senderAcc" style={{ marginBottom: '1px' }}>{receiptData.senderAccount || '0123456789'}</div>
                <div>STANBIC IBTC BANK</div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="divider" style={{ borderBottom: '2px solid #2e3aa1', margin: '6px 0' }}></div>

            {/* ROW 4: STATUS */}
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11.5px', margin: '2px 0' }}>
              <div className="label" style={{ color: '#222222' }}>STATUS</div>
              <div className="value status" style={{ textAlign: 'right', fontWeight: 600, color: '#000000' }}>SUCCESSFUL</div>
            </div>

            {/* DIVIDER */}
            <div className="divider" style={{ borderBottom: '2px solid #2e3aa1', margin: '6px 0' }}></div>

            {/* ROW 5: NARRATION */}
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11.5px', margin: '2px 0' }}>
              <div className="label" style={{ color: '#222222' }}>NARRATION</div>
              <div className="value" id="narration" style={{ textAlign: 'right', fontWeight: 500, color: '#000000' }}>
                {receiptData.narration}
              </div>
            </div>

            {/* NOTICE BOX */}
            <div
              className="notice"
              style={{
                background: '#e6f0fb',
                padding: '10px 12px',
                marginTop: '12px',
                fontSize: '10.5px',
                lineHeight: 1.4,
                color: '#1c2c8c',
              }}
            >
              <b>Notice</b>
              <br />
              <br />
              This is an online auto generated transaction receipt.
              <br />
              <br />
              This is an authentic receipt, for further inquiries, contact 0700 909 909 909
              <br />
              <br />
              Email CustomerCareNigeria@stanbicibtc.com
              <br />
              <br />
              Generated from Stanbic IBTC Super App
            </div>
          </div>
        </motion.div>

        {/* DOWNLOAD ACTION BUTTON */}
        <div className="w-full max-w-[420px] mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 bg-[#1c2c8c] hover:bg-blue-900 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>{downloading ? 'Generating Image...' : 'Download Stanbic Receipt (PNG)'}</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
};
