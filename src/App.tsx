import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SplashPage } from './pages/SplashPage';
import { CountrySelectionPage } from './pages/CountrySelectionPage';
import { NigeriaBanksPage } from './pages/NigeriaBanksPage';
import { NotAvailablePage } from './pages/NotAvailablePage';
import { AccessBankReceiptPage } from './pages/AccessBankReceiptPage';
import { AccessBankGeneratedPage } from './pages/AccessBankGeneratedPage';
import { StanbicBankReceiptPage } from './pages/StanbicBankReceiptPage';
import { StanbicBankGeneratedPage } from './pages/StanbicBankGeneratedPage';
import { MoniepointReceiptPage } from './pages/MoniepointReceiptPage';
import { MoniepointGeneratedPage } from './pages/MoniepointGeneratedPage';
import { GCashReceiptPage } from './pages/GCashReceiptPage';
import { GCashGeneratedPage } from './pages/GCashGeneratedPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-blue-500 selection:text-white">
        <Routes>
          {/* Page 1: Splash / Welcome */}
          <Route path="/" element={<SplashPage />} />

          {/* Page 2: Country Selection */}
          <Route path="/select-country" element={<CountrySelectionPage />} />

          {/* Page 3: Nigeria Banks */}
          <Route path="/nigeria-banks" element={<NigeriaBanksPage />} />

          {/* Page 4: Access Bank Form Page */}
          <Route path="/nigeria-banks/access/receipt" element={<AccessBankReceiptPage />} />
          <Route path="/nigeria/access/receipt" element={<AccessBankReceiptPage />} />
          <Route path="/access-bank-receipt" element={<AccessBankReceiptPage />} />

          {/* Page 5: Access Bank Generated Receipt Page */}
          <Route path="/nigeria-banks/access/generated" element={<AccessBankGeneratedPage />} />

          {/* Page 6: Stanbic IBTC Bank Form Page */}
          <Route path="/nigeria-banks/stanbic/receipt" element={<StanbicBankReceiptPage />} />
          <Route path="/stanbic-bank-receipt" element={<StanbicBankReceiptPage />} />

          {/* Page 7: Stanbic IBTC Bank Generated Receipt Page */}
          <Route path="/nigeria-banks/stanbic/generated" element={<StanbicBankGeneratedPage />} />

          {/* Page 8: Moniepoint Form Page */}
          <Route path="/nigeria-banks/moniepoint/receipt" element={<MoniepointReceiptPage />} />
          <Route path="/moniepoint-receipt" element={<MoniepointReceiptPage />} />

          {/* Page 9: Moniepoint Generated Receipt Page */}
          <Route path="/nigeria-banks/moniepoint/generated" element={<MoniepointGeneratedPage />} />

          {/* Page 10: GCash Form & Generated Pages */}
          <Route path="/gcash/receipt" element={<GCashReceiptPage />} />
          <Route path="/gcash/generated" element={<GCashGeneratedPage />} />

          {/* Page 8: Not Available */}
          <Route path="/not-available" element={<NotAvailablePage />} />

          {/* Catch-all redirect to Welcome Screen */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
