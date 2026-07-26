import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Download,
  ArrowLeft,
  Edit3,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';

interface ReceiptData {
  amount: string;
  senderName: string;
  receiverName: string;
  receiverAccount: string;
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

export const AccessBankGeneratedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Retrieve form data from location state or fallback to sessionStorage
  const getInitialData = (): ReceiptData => {
    if (location.state?.formData) {
      return location.state.formData;
    }
    const saved = sessionStorage.getItem('access_receipt_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved receipt data', err);
      }
    }
    // Default placeholder fallback
    return {
      amount: 'N10,000.00',
      senderName: 'BENJAMIN GEORGE',
      receiverName: 'RAKIYA GEORGE',
      receiverAccount: '0116464944',
      receiverBank: 'OPAY LIMITED',
      narration: 'BENNIE',
      date: '2026-07-23',
      time: '11:45',
      refCode: `NXG0000${generateRandomDigits(26)}`,
      sessionId: generateRandomDigits(30),
    };
  };

  const receiptData = getInitialData();

  // Ensure amount display uses N or ₦ correctly
  let displayAmount = receiptData.amount.trim();
  if (!displayAmount.startsWith('N') && !displayAmount.startsWith('₦')) {
    displayAmount = `N${displayAmount}`;
  }

  // Automatic Transaction Reference (NXG0000 + 26 random digits) and Session Id (30 random digits)
  const refCode = receiptData.refCode || `NXG0000${generateRandomDigits(26)}`;
  const sessionId = receiptData.sessionId || generateRandomDigits(30);

  // Download receipt as PNG using html2canvas with isolated element clone
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);

    try {
      const fileName = `AccessBank_Receipt_${receiptData.receiverName.replace(/\s+/g, '_')}.png`;

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
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            const clonedCard = clonedDoc.querySelector('#access-bank-receipt-card') || clonedDoc.body.firstElementChild;
            if (clonedCard && clonedCard instanceof HTMLElement) {
              clonedDoc.body.innerHTML = '';
              clonedDoc.body.appendChild(clonedCard);
              clonedDoc.body.style.margin = '0';
              clonedDoc.body.style.padding = '0';
              clonedDoc.body.style.backgroundColor = '#ffffff';

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
          backgroundColor: '#ffffff',
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
    } catch (error) {
      console.error('Error generating image download:', error);
      alert('Could not download receipt image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      <Navbar showBack={true} />

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Top Header / Status bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/nigeria-banks/access/receipt')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Edit Form</span>
          </button>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Receipt Ready</span>
          </span>
        </div>

        {/* The Access Bank Receipt Container (Matching User's exact HTML/CSS template) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div
            ref={receiptRef}
            id="access-bank-receipt-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#ffffff',
              padding: '20px 16px 18px',
              color: '#1E2F8E',
              fontFamily: 'Arial, Helvetica, sans-serif',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            {/* Logo Header Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width="160" height="42" fill="none">
                  <g transform="translate(5, 8)">
                    <path d="M18 25L30 7L42 25L30 43L18 25Z" fill="none" stroke="#D88918" strokeWidth="2.5" />
                    <path d="M23 25L30 15L37 25L30 35L23 25Z" fill="none" stroke="#D88918" strokeWidth="1.8" />
                    <path d="M27 25L30 21L33 25L30 29L27 25Z" fill="#D88918" />
                  </g>
                  <text x="55" y="42" fontFamily="Arial, Helvetica, sans-serif" fontSize="30" fontWeight="600" fill="#1E2F8E" letterSpacing="-1">
                    access
                  </text>
                </svg>
              </div>

              <div style={{ flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 65" width="130" height="42" fill="none">
                  <line x1="15" y1="50" x2="42" y2="8" stroke="#D88918" strokeWidth="4" strokeLinecap="round" />
                  <text x="48" y="35" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="500" fill="#D88918">
                    more than banking
                  </text>
                </svg>
              </div>
            </div>

            {/* Transaction Title */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#1E2F8E',
                textAlign: 'center',
                marginBottom: '4px',
                letterSpacing: '0.3px',
              }}
            >
              Transaction Receipt
            </div>

            {/* Generated Info */}
            <div
              style={{
                fontSize: '8px',
                margin: '0 0 18px 0',
                color: '#9C9C9C',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              Generated from <span style={{ fontWeight: 'bold', color: '#777777' }}>AccessMore</span> on{' '}
              <span style={{ color: '#9C9C9C' }}>{receiptData.date} {receiptData.time}</span>
            </div>

            {/* Transaction Details Table */}
            <div style={{ width: '100%' }}>
              {/* Row 1: Amount */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  borderTop: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Transaction Amount
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 'bold' }}>
                  {displayAmount}
                </div>
              </div>

              {/* Row 2: Type */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Transaction Type
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 600 }}>
                  INTER-BANK
                </div>
              </div>

              {/* Row 3: Date */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Transaction Date
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 600 }}>
                  {receiptData.date} {receiptData.time}
                </div>
              </div>

              {/* Row 4: Sender */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Sender
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase' }}>
                  {receiptData.senderName}
                </div>
              </div>

              {/* Row 5: Beneficiary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'start',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left', paddingTop: '16px' }}>
                  Beneficiary
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', fontWeight: 600, padding: '2px 0px', lineHeight: '1.45', textAlign: 'left' }}>
                  <div style={{ textTransform: 'uppercase' }}>{receiptData.receiverName}</div>
                  <div>{receiptData.receiverAccount}</div>
                  <div style={{ textTransform: 'uppercase' }}>{receiptData.receiverBank}</div>
                </div>
              </div>

              {/* Row 6: Remark */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Remark
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase' }}>
                  {receiptData.narration}
                </div>
              </div>

              {/* Row 7: Transaction Reference */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Transaction Reference
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 600, wordBreak: 'break-all' }}>
                  {refCode}
                </div>
              </div>

              {/* Row 8: Session Id */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Session Id
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 600, wordBreak: 'break-all' }}>
                  {sessionId}
                </div>
              </div>

              {/* Row 9: Transaction Status */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  padding: '10px 0px',
                  borderBottom: '0.5px solid #E6E6E6',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '10px', color: '#D88918', fontWeight: 600, textAlign: 'left' }}>
                  Transaction Status
                </div>
                <div style={{ fontSize: '10px', color: '#1E2F8E', textAlign: 'left', fontWeight: 600 }}>
                  Successful
                </div>
              </div>
            </div>

            {/* Footer Contact Info */}
            <div
              style={{
                fontSize: '7px',
                marginTop: '16px',
                marginBottom: '8px',
                color: '#9C9C9C',
                lineHeight: 1.5,
                textAlign: 'left',
              }}
            >
              If you have any questions or would like more information, please call our 24-hour Contact Centre on<br />
              <span style={{ color: '#1E2F8E', textDecoration: 'underline' }}>0700CallAccess</span>,{' '}
              <span style={{ color: '#1E2F8E', textDecoration: 'underline' }}>0700 30000000</span>,{' '}
              <span style={{ color: '#1E2F8E', textDecoration: 'underline' }}>+234 201-2712005-7</span>,{' '}
              <span style={{ color: '#1E2F8E', textDecoration: 'underline' }}>+234 201-2802500</span> or send an email to<br />
              <span style={{ color: '#1E2F8E', textDecoration: 'underline' }}>contactcenter@accessbankplc.com</span><br />
              Thank you for choosing Access Bank.
            </div>

            <div
              style={{
                fontSize: '7px',
                marginTop: '8px',
                marginBottom: '10px',
                color: '#9C9C9C',
                lineHeight: 1.4,
                textAlign: 'left',
              }}
            >
              Banking with Access: Branch | ATM | Online | Mobile | Contact centre
            </div>
          </div>
        </motion.div>

        {/* Download Receipt Button & Navigation */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>{isDownloading ? 'Generating PNG...' : 'Download Receipt'}</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/nigeria-banks/access/receipt')}
              className="flex-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={() => navigate('/nigeria-banks')}
              className="flex-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Banks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
