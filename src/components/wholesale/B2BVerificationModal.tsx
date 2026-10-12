import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const B2BVerificationModal: React.FC = () => {
  const {
    isB2BRegisterOpen,
    setIsB2BRegisterOpen,
    user,
    updateUser,
    showToast,
  } = useApp();

  const [companyName, setCompanyName] = useState(
    user.b2bProfile?.companyName || 'Shrestha Kirana & FMCG Distribution'
  );
  const [panNumber, setPanNumber] = useState(user.b2bProfile?.panNumber || '601928374');
  const [vatRegistered, setVatRegistered] = useState(user.b2bProfile?.vatRegistered ?? true);
  const [businessType, setBusinessType] = useState<any>(
    user.b2bProfile?.businessType || 'Kirana Store'
  );
  const [creditLimitRequested, setCreditLimitRequested] = useState(
    user.b2bProfile?.creditLimit || 250000
  );
  const [contactPerson, setContactPerson] = useState(user.b2bProfile?.contactPerson || user.name);
  const [contactPhone, setContactPhone] = useState(user.b2bProfile?.contactPhone || user.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isB2BRegisterOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (panNumber.length !== 9) {
      showToast('Nepal PAN number must be exactly 9 numeric digits');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      updateUser({
        b2bProfile: {
          companyName,
          panNumber,
          vatRegistered,
          businessType,
          verificationStatus: 'verified',
          creditLimit: creditLimitRequested,
          usedCredit: user.b2bProfile?.usedCredit || 0,
          paymentTermsDays: 30,
          contactPerson,
          contactPhone,
          taxClearanceUploaded: true,
        },
      });
      showToast('B2B Business Verified! Rs. ' + creditLimitRequested.toLocaleString() + ' credit line active.');
      setIsB2BRegisterOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                B2B Business & Credit Account
              </h2>
              <span className="text-xs text-neutral-500">
                Government of Nepal PAN/VAT Verification
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsB2BRegisterOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Current Status banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold">Verified Kirana Wholesale Partner</span>
            </div>
            <span className="text-[11px] font-bold bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900">
              Approved
            </span>
          </div>

          <div>
            <label className="font-medium text-neutral-700 block mb-1">
              Registered Business / Firm Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 block mb-1">
                Nepal Permanent Account Number (PAN)
              </label>
              <input
                type="text"
                maxLength={9}
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9-digit numeric PAN"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="font-medium text-neutral-700 block mb-1">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
              >
                <option value="Kirana Store">Kirana / Retail Grocery Store</option>
                <option value="Supermarket">Supermarket / Mart</option>
                <option value="Restaurant / Hotel">Restaurant / Hotel / Café</option>
                <option value="Wholesale Distributor">Wholesale Sub-Distributor</option>
                <option value="Office / Corporate">Corporate / Institution Canteen</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="vatReg"
              checked={vatRegistered}
              onChange={(e) => setVatRegistered(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-800"
            />
            <label htmlFor="vatReg" className="text-neutral-700 font-medium">
              Registered for Value Added Tax (VAT) with Inland Revenue Department
            </label>
          </div>

          {/* Credit Limit & Terms */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-900">
                Requested Revolving Credit Limit:
              </span>
              <span className="text-sm font-bold text-emerald-900 tabular-nums">
                Rs. {creditLimitRequested.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="25000"
              value={creditLimitRequested}
              onChange={(e) => setCreditLimitRequested(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span>Rs. 50,000 (Starter)</span>
              <span>Payment Terms: 30 Days Net</span>
              <span>Rs. 500,000 (High Volume)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 block mb-1">Authorized Contact</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                required
              />
            </div>
            <div>
              <label className="font-medium text-neutral-700 block mb-1">Direct Phone (+977)</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                required
              />
            </div>
          </div>

          {/* Tax Clearance Upload */}
          <div className="border border-dashed border-neutral-300 rounded-xl p-3 text-center bg-white">
            <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
            <span className="font-medium text-neutral-700 block">
              PAN Certificate / Tax Clearance Uploaded
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              pan_registration_cert_2026.pdf (Verified)
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsB2BRegisterOpen(false)}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold cursor-pointer transition-colors shadow-sm"
            >
              {isSubmitting ? 'Verifying with IRD...' : 'Update B2B Account Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
