import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Download,
  Copy,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { Navbar } from '../components/Navbar';
import { KudaReceiptData } from './KudaReceiptPage';

export const KudaGeneratedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Retrieve data from location state or sessionStorage
  const [data, setData] = useState<KudaReceiptData | null>(() => {
    if (location.state) {
      return location.state as KudaReceiptData;
    }
    try {
      const stored = sessionStorage.getItem('kuda_receipt_data');
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
        amount: '200.00',
        beneficiaryName: 'BENJAMIN CHIKUKA GEORGE',
        beneficiaryBank: 'Opay Digital Services Limited',
        beneficiaryAccount: '8062827392',
        senderName: 'GEORGE, CHIKUKA BENJAMIN',
        senderBank: 'Kuda',
        senderAccount: '2084860642',
        paidDate: 'July 28, 2026',
        paidTime: '07:54 AM',
        fees: '0.0',
        vat: '0.0',
        description: 'BigBen',
        transRef: '090267260728065443364084860642',
        paymentType: 'Outward Transfer',
      });
    }
  }, [data]);

  if (!data) return null;

  const formatCurrency = (val: string) => {
    if (!val || !val.trim()) return '₦0.0';
    let cleaned = val.trim();
    if (cleaned.startsWith('₦')) {
      cleaned = cleaned.substring(1).trim();
    }
    if (!isNaN(Number(cleaned))) {
      const num = Number(cleaned);
      if (num === 0) return '₦0.0';
      return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₦${cleaned}`;
  };

  const formattedAmount = formatCurrency(data.amount).replace('₦', '₦');
  const formattedFees = formatCurrency(data.fees);
  const formattedVat = formatCurrency(data.vat);

  const handleCopyText = () => {
    const text = `KUDA TRANSACTION RECEIPT
Transaction Details
Transaction Amount: ${formattedAmount}
Beneficiary: ${data.beneficiaryName} (${data.beneficiaryBank} | ${data.beneficiaryAccount})
Sender: ${data.senderName} (${data.senderBank} | ${data.senderAccount})
Paid On: ${data.paidDate} ${data.paidTime}
Fees: ${formattedFees}
VAT: ${formattedVat}
Description: ${data.description}
Ref: ${data.transRef}
Payment Type: ${data.paymentType}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);

    try {
      const fileName = `Kuda_Receipt_${(data.beneficiaryName || 'Transaction').replace(/\s+/g, '_')}.png`;

      // Sanitize document.head styles before html2canvas/toPng to prevent oklab/oklch parse errors
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
        });
        dataUrl = canvas.toDataURL('image/png', 1.0);
      } catch (h2cErr) {
        console.warn('html2canvas error, using toPng fallback:', h2cErr);
        dataUrl = await toPng(receiptRef.current, {
          quality: 1.0,
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: '#ffffff',
        });
      } finally {
        // Restore style elements
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
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Unable to save receipt image automatically. Please try taking a screenshot.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      <Navbar showBack={true} />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Navigation Actions Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/nigeria-banks/kuda/receipt')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Edit Form</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-purple-700 hover:bg-purple-800 px-3.5 py-1.5 rounded-full shadow-md shadow-purple-700/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Download PNG'}</span>
            </button>
          </div>
        </div>

        {/* RECEIPT CONTAINER FOR EXPORT */}
        <div className="flex justify-center">
          <div
            ref={receiptRef}
            id="kuda-receipt-card"
            className="w-full max-w-[330px] bg-white p-[18px_16px_12px] shadow-xl border border-slate-200 select-none"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              WebkitFontSmoothing: 'antialiased',
              boxSizing: 'border-box',
            }}
          >
            {/* Header: Logo top-left (kuda.png) & Transaction Details top-right */}
            <div className="flex items-center justify-between mb-[24px]">
              <div className="flex items-center">
                <img src="/kuda.png" alt="Kuda" className="h-[48px] w-auto block object-contain" />
              </div>
              <div className="text-[17px] font-normal text-[#222]">
                Transaction Details
              </div>
            </div>

            {/* Amount Section */}
            <div className="text-center mb-[20px]">
              <div className="text-[10.8px] font-medium text-[#444] mb-[4px]">
                Transaction Amount
              </div>
              <div className="text-[21.6px] font-bold text-[#222]">
                {formattedAmount}
              </div>
            </div>

            {/* Detail Rows */}
            {/* Beneficiary Details */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                Beneficiary Details
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4] word-break-all max-w-[190px]">
                {data.beneficiaryName}
                <span className="block text-[9.9px] text-[#bbb] font-normal mt-[2px]">
                  {data.beneficiaryBank} | {data.beneficiaryAccount}
                </span>
              </div>
            </div>

            {/* Sender Details */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                Sender Details
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4] word-break-all max-w-[190px]">
                {data.senderName}
                <span className="block text-[9.9px] text-[#bbb] font-normal mt-[2px]">
                  {data.senderBank} | {data.senderAccount}
                </span>
              </div>
            </div>

            {/* Paid On */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                Paid On
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4]">
                {data.paidDate}
                <span className="block text-[9.9px] text-[#bbb] font-normal mt-[2px]">
                  {data.paidTime}
                </span>
              </div>
            </div>

            {/* Fees */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                Fees
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4]">
                {formattedFees}
              </div>
            </div>

            {/* VAT */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                VAT
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4]">
                {formattedVat}
              </div>
            </div>

            {/* Description */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                Description
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4]">
                {data.description}
              </div>
            </div>

            {/* Transaction Reference */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                Transaction Reference
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4] break-all max-w-[160px]">
                {data.transRef}
              </div>
            </div>

            {/* Payment Type */}
            <div className="flex justify-between items-start py-[9px] border-b border-[#e0e0e0]">
              <div className="text-[10.8px] text-[#bbb] font-normal shrink-0 pr-[10px] leading-[1.4]">
                Payment Type
              </div>
              <div className="text-right text-[10.8px] text-[#444] font-normal leading-[1.4]">
                {data.paymentType}
              </div>
            </div>

            {/* Promo Banner ("Not on Kuda?") */}
            {/* Centered squarish light purple container matching original image */}
            <div className="w-[235px] bg-[#f0f0fa] rounded-[20px] p-[20px_16px] mx-auto flex items-center justify-center gap-[14px] mt-[20px] mb-[18px]">
              <div className="w-[66px] h-[66px] bg-[#2b0854] rounded-[18px] shrink-0 overflow-hidden flex items-center justify-center p-0 shadow-2xs">
                <img
                  src="/kuda2.png"
                  alt="Kuda"
                  className="w-full h-full object-cover block"
                />
              </div>
              <div className="flex flex-col justify-center text-left">
                <div className="text-[13.5px] font-bold text-[#2b0854] leading-[1.25] tracking-[-0.2px] mb-[2px]">
                  Not on Kuda?
                </div>
                <div className="text-[11.5px] font-bold text-[#2b0854] leading-[1.3] tracking-[-0.2px]">
                  Tap here to<br />
                  download the<br />
                  money app for<br />
                  Africans
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-[4px]">
              <p className="text-[6.75px] text-[#ccc] leading-[1.6] font-normal mb-[3px]">
                © 2026 Kuda Technologies Ltd (Company No. 11472232).
              </p>
              <p className="text-[6.75px] text-[#ccc] leading-[1.6] font-normal">
                All rights reserved. Nigerian banking services offered by Kuda Microfinance Bank (RC796975) with registered address at 1-11 Commercial avenue, Yaba, Lagos, Nigeria. Kuda Microfinance Bank is licensed by the Central Bank of Nigeria. Deposits are insured by the Nigerian Deposit Insurance Corporation (NDIC).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
