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
  Printer,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';

interface ReceiptData {
  amount: string;
  senderName: string;
  sourceInstitution: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryInstitution: string;
  transactionType: string;
  transactionStatus: string;
  narration?: string;
  date: string;
  time: string;
  transRef: string;
  providerRef: string;
}

// Helper to generate precise, uniform perforated receipt tear line (15 large cuts across 450px width)
const generatePerforatedCutPath = (width = 450) => {
  const holeRadius = 11;
  const holeDiameter = 22;
  const gap = 8;
  const step = holeDiameter + gap; // 30px => exactly 15 cuts for 450px!
  const count = Math.ceil(width / step);

  let d = `M 0 0 L 0 ${holeRadius} `;
  for (let i = 0; i < count; i++) {
    const xStart = i * step;
    const xHoleEnd = Math.min(xStart + holeDiameter, width);
    const xStepEnd = Math.min(xStart + step, width);

    if (xStart >= width) break;

    if (xHoleEnd <= width) {
      d += `A ${holeRadius} ${holeRadius} 0 0 1 ${xHoleEnd} ${holeRadius} `;
    } else {
      const dx = width - xStart;
      const yVal = holeRadius - Math.sqrt(Math.max(0, holeRadius * holeRadius - Math.pow(dx - holeRadius, 2)));
      d += `A ${holeRadius} ${holeRadius} 0 0 1 ${width} ${yVal} `;
    }

    if (xStepEnd > xHoleEnd) {
      d += `L ${xStepEnd} ${holeRadius} `;
    }
  }
  d += `L ${width} 0 Z`;
  return d;
};

export const MoniepointGeneratedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Retrieve data from location.state or sessionStorage
  const [data, setData] = useState<ReceiptData | null>(() => {
    if (location.state) {
      return location.state as ReceiptData;
    }
    try {
      const stored = sessionStorage.getItem('moniepoint_receipt_data');
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
      // Default sample fallback data matching user screenshot
      const sampleData: ReceiptData = {
        amount: '190.00',
        senderName: 'RAKIYA GEORGE',
        sourceInstitution: 'MONIEPOINT',
        beneficiaryName: 'MUHAMMAD BELLO',
        beneficiaryAccount: '8062827392',
        beneficiaryInstitution: 'MOMO PSB',
        transactionType: 'Transfer',
        transactionStatus: 'Successful',
        date: '2026-07-07',
        time: '12:46',
        transRef: 'TRF|2MPTnej9u|2074459992691556352',
        providerRef: '090405260707124618792512440126',
      };
      setData(sampleData);
    }
  }, [data]);

  if (!data) return null;

  // Format date: "Tuesday, July 7th, 2026 | 12:46 PM"
  const getFormattedDateTime = (dateStr: string, timeStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);

      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthsOfYear = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const dayName = daysOfWeek[dateObj.getDay()] || 'Tuesday';
      const monthName = monthsOfYear[dateObj.getMonth()] || 'July';

      // Ordinal suffix (1st, 2nd, 3rd, 7th, etc.)
      const getOrdinal = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      const dayWithSuffix = getOrdinal(day || 7);

      // Time formatting
      let formattedTime = '12:46 PM';
      if (timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        const displayM = String(m).padStart(2, '0');
        formattedTime = `${displayH}:${displayM} ${ampm}`;
      }

      return `${dayName}, ${monthName} ${dayWithSuffix}, ${year || 2026} | ${formattedTime}`;
    } catch {
      return 'Tuesday, July 7th, 2026 | 12:46 PM';
    }
  };

  const formattedAmount = Number(data.amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const getAmountFontSize = (amountStr: string) => {
    const fullStr = '₦' + amountStr;
    const len = fullStr.length;
    if (len > 15) return '20px';
    if (len > 13) return '24px';
    if (len > 11) return '28px';
    if (len > 9) return '32px';
    return '36px';
  };

  const formattedDateTime = getFormattedDateTime(data.date, data.time);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    try {
      setDownloading(true);
      const fileName = `Moniepoint_Receipt_${(data?.beneficiaryName || 'Transaction').replace(/\s+/g, '_')}.png`;

      // Sanitize document.head styles before html2canvas/toPng parses CSS rules to avoid Tailwind v4 oklab/oklch parser errors
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
          backgroundColor: null,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            const clonedCard = clonedDoc.querySelector('#moniepoint-receipt-card') as HTMLElement;
            if (clonedCard) {
              // Isolate clonedCard at top (0,0) of body to remove vertical scroll offsets or parent margin padding
              clonedDoc.body.innerHTML = '';
              clonedDoc.body.appendChild(clonedCard);

              clonedDoc.body.style.margin = '0';
              clonedDoc.body.style.padding = '0';
              clonedDoc.body.style.width = '450px';
              clonedDoc.body.style.backgroundColor = 'transparent';

              clonedCard.style.position = 'relative';
              clonedCard.style.top = '0';
              clonedCard.style.left = '0';
              clonedCard.style.margin = '0 auto';
              clonedCard.style.transform = 'none';
              clonedCard.style.width = '450px';
              clonedCard.style.maxWidth = '450px';
              clonedCard.style.minWidth = '450px';
              clonedCard.style.borderRadius = '28px';
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
          backgroundColor: '#005AE8',
          style: {
            width: '450px',
            maxWidth: '450px',
            margin: '0',
            transform: 'none',
          },
        });
      } finally {
        // Restore document style elements
        styleElements.forEach((s, idx) => {
          if (originalTexts[idx] !== null) {
            s.textContent = originalTexts[idx];
          }
        });
      }

      if (dataUrl) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Could not create data URL');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Unable to download receipt image automatically. Please take a screenshot or try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = () => {
    const text = `MONIEPOINT TRANSACTION RECEIPT
Amount: ₦${formattedAmount}
Sender: ${data.senderName} (${data.sourceInstitution})
Beneficiary: ${data.beneficiaryName} | ${data.beneficiaryAccount} (${data.beneficiaryInstitution})
Status: ${data.transactionStatus}
Date: ${formattedDateTime}
Ref: ${data.transRef}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 md:py-8 flex flex-col items-center">
        {/* Navigation bar actions */}
        <div className="w-full max-w-[430px] flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/nigeria-banks/moniepoint/receipt')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Edit Form
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl shadow-xs border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-[#005AE8] px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Download PNG'}</span>
            </button>
          </div>
        </div>

        {/* RECEIPT WRAPPER - Pixel-perfect Moniepoint layout matching official branding */}
        <motion.div
          id="moniepoint-receipt-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          ref={receiptRef}
          className="relative w-full max-w-[450px] bg-[#005AE8] pt-[28px] px-[12px] sm:px-[14px] pb-[40px] overflow-hidden rounded-[28px] shadow-2xl text-slate-900 select-none my-auto"
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {/* BACKGROUND GOLD BRAND CURVES */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 450 880"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Right Arc Swoosh */}
            <circle cx="430" cy="-20" r="160" stroke="#F5B400" strokeWidth="32" fill="none" />
            {/* Left Mid Arc Accent */}
            <circle cx="-40" cy="420" r="110" stroke="#F5B400" strokeWidth="26" fill="none" />
            {/* Bottom Right Arc Swoosh */}
            <circle cx="440" cy="850" r="120" stroke="#F5B400" strokeWidth="30" fill="none" />
          </svg>

          {/* HEADER BRANDING */}
          <div className="relative z-10 pb-[20px] flex items-center justify-center gap-2.5">
            {/* Moniepoint M logo badge */}
            <div className="w-[42px] h-[42px] bg-white rounded-[12px] flex items-center justify-center shadow-xs shrink-0">
              <span className="text-[#005AE8] text-[22px] font-[900] tracking-tighter leading-none select-none">M</span>
            </div>

            {/* Brand Titles */}
            <div className="flex flex-col">
              <h1 className="text-white text-[24px] font-[800] tracking-[-0.5px] leading-none">
                Moniepoint
              </h1>
              <p className="mt-[4px] text-[7.5px] font-[700] tracking-[2.8px] text-white/90 uppercase">
                MICROFINANCE BANK
              </p>
            </div>
          </div>

          {/* WHITE MAIN CARD */}
          <div className="relative z-10">
            {/* White Card Body */}
            <div className="bg-white rounded-t-[20px] pt-[20px] px-[16px] pb-[0px]">
              {/* TOP CARD SECTION: BADGE + AMOUNT + M ICON */}
              <div className="flex justify-between items-start mb-[18px] gap-2">
                <div className="flex-1 min-w-0 pr-1">
                  <div className="inline-flex items-center justify-center px-[10px] py-[4px] rounded-[5px] text-[12px] font-[700] tracking-[0.3px] bg-[#D6E4FF] text-[#005AE8] uppercase">
                    DEBIT
                  </div>
                  <div
                    className="mt-[8px] font-[800] tracking-[-0.8px] text-[#000000] leading-none whitespace-nowrap"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: getAmountFontSize(formattedAmount),
                    }}
                  >
                    ₦{formattedAmount}
                  </div>
                </div>

                {/* Right Moniepoint Logo Badge */}
                <div className="w-[44px] h-[44px] rounded-[12px] bg-[#005AE8] flex justify-center items-center shrink-0 shadow-xs">
                  <span className="text-white text-[22px] font-[900] tracking-tighter leading-none select-none">M</span>
                </div>
              </div>

              {/* PANEL WITH TRANSACTION DETAILS */}
              <div className="bg-[#F3F5F9] rounded-[18px] px-[18px] py-[6px]">
                {/* Row 1: Transaction Type */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Transaction Type
                  </span>
                  <div>
                    <span className="inline-flex items-center justify-center px-[10px] py-[4px] rounded-[5px] text-[12px] font-[600] bg-[#E2ECFF] text-[#005AE8]">
                      {data.transactionType || 'Transfer'}
                    </span>
                  </div>
                </div>

                {/* Row 2: Transaction Status */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Transaction Status
                  </span>
                  <div>
                    <span className="inline-flex items-center justify-center px-[10px] py-[4px] rounded-[5px] text-[12px] font-[600] bg-[#DCF5E3] text-[#15A047]">
                      {data.transactionStatus || 'Successful'}
                    </span>
                  </div>
                </div>

                {/* Row 3: Sender Name */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Sender Name
                  </span>
                  <span className="text-[13.5px] font-[500] text-[#000000] leading-snug tracking-[-0.2px] uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {data.senderName}
                  </span>
                </div>

                {/* Row 4: Source Institution */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Source Institution
                  </span>
                  <span className="text-[13.5px] font-[500] text-[#000000] leading-snug tracking-[-0.2px] uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {data.sourceInstitution || 'MONIEPOINT'}
                  </span>
                </div>

                {/* Row 5: Beneficiary */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Beneficiary
                  </span>
                  <span className="text-[13.5px] font-[500] text-[#000000] leading-snug tracking-[-0.2px] uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {data.beneficiaryName} | {data.beneficiaryAccount}
                  </span>
                </div>

                {/* Row 6: Beneficiary Institution */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Beneficiary Institution
                  </span>
                  <span className="text-[13.5px] font-[500] text-[#000000] leading-snug tracking-[-0.2px] uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {data.beneficiaryInstitution}
                  </span>
                </div>

                {/* Row 7: Transaction Date */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Transaction Date
                  </span>
                  <span className="text-[13.5px] font-[500] text-[#000000] leading-snug tracking-[-0.2px] whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {formattedDateTime}
                  </span>
                </div>

                {/* Row 8: Transaction Reference */}
                <div className="py-[11px] border-b border-[#EDF1F5] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Transaction Reference
                  </span>
                  <span className="text-[13.5px] font-[500] text-[#000000] leading-snug tracking-[-0.2px] whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {data.transRef}
                  </span>
                </div>

                {/* Row 9: Provider Reference */}
                <div className="py-[11px] flex flex-col items-start">
                  <span className="text-[13px] font-[400] text-[#8B8F97] mb-[4px]">
                    Provider Reference
                  </span>
                  <span className="text-[13.5px] font-[500] text-[#000000] leading-snug tracking-[-0.2px] whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {data.providerRef}
                  </span>
                </div>
              </div>
            </div>

            {/* SCALLOPED / PERFORATED WHITE RECEIPT TEAR AT BOTTOM */}
            <div className="w-full leading-none overflow-hidden select-none pointer-events-none -mt-[1px]">
              <svg
                className="w-full h-[12px] block text-white fill-current"
                viewBox="0 0 450 12"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={generatePerforatedCutPath(450)} />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Action button bar */}
        <div className="w-full max-w-[430px] mt-6 flex flex-col gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3.5 bg-[#005AE8] hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PNG...' : 'Download High-Res Receipt (PNG)'}</span>
          </button>

          <button
            onClick={() => navigate('/nigeria-banks/moniepoint/receipt')}
            className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Generate Another Moniepoint Receipt</span>
          </button>
        </div>
      </main>
    </div>
  );
};
