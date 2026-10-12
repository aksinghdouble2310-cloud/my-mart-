import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setRole } = useApp();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 text-xs">
      {/* 4 Value Pillars Banner */}
      <div className="border-b border-neutral-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Direct Distribution</h4>
              <p className="text-neutral-400 mt-1 leading-relaxed">
                Factory-to-doorstep logistics with zero middlemen markup for Kirana stores & households.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Genuine FMCG</h4>
              <p className="text-neutral-400 mt-1 leading-relaxed">
                Authorized supply chain sourcing with strict batch expiry and quality seals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Valley Express Delivery</h4>
              <p className="text-neutral-400 mt-1 leading-relaxed">
                Same-day slots in Kathmandu, Lalitpur, and Bhaktapur. 24-48hr regional freight.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Hassle-Free Returns</h4>
              <p className="text-neutral-400 mt-1 leading-relaxed">
                Damaged or mismatched stock replaced within 24 hours with dedicated RMA audit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
              MM
            </div>
            <span className="text-base font-bold text-white tracking-tight">My Mart Industries Pvt. Ltd.</span>
          </div>
          <p className="text-neutral-400 leading-relaxed mb-4">
            Nepal’s premier integrated grocery commerce & FMCG wholesale distribution platform, empowering retail families and local Kirana store owners.
          </p>
          <div className="text-neutral-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Balaju Industrial Area, Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>+977-1-4982345 / 9801987654</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>support@mymart.com.np</span>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3 text-sm">B2B Wholesale Solutions</h5>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <button onClick={() => setRole('wholesale')} className="hover:text-emerald-400 transition-colors">
                Kirana Bulk Price List
              </button>
            </li>
            <li>
              <button onClick={() => setRole('wholesale')} className="hover:text-emerald-400 transition-colors">
                Quick-Order Spreadsheet
              </button>
            </li>
            <li>
              <button onClick={() => setRole('wholesale')} className="hover:text-emerald-400 transition-colors">
                B2B 30-Day Credit Accounts
              </button>
            </li>
            <li>
              <span className="text-neutral-500">Master Carton Quantities (MOQ)</span>
            </li>
            <li>
              <span className="text-neutral-500">VAT Invoices & PAN Billing</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3 text-sm">Customer Services</h5>
          <ul className="space-y-2 text-neutral-400">
            <li><span>Kathmandu Valley Express Zones</span></li>
            <li><span>Delivery Rates & Slot Timings</span></li>
            <li><span>eSewa, Khalti & Fonepay QR</span></li>
            <li><span>Cash on Delivery (COD) Rules</span></li>
            <li><span>Return & Refund Claim Request</span></li>
            <li><span>Food Safety Standards (DFTQC Compliant)</span></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3 text-sm">Operations & Staff</h5>
          <p className="text-neutral-400 mb-3 leading-relaxed">
            Switch directly to operational portals to simulate staff fulfillment and delivery fleet management.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setRole('delivery')}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-left transition-colors font-medium cursor-pointer"
            >
              Open Delivery Driver Console →
            </button>
            <button
              onClick={() => setRole('admin')}
              className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded-md text-left transition-colors font-medium cursor-pointer"
            >
              Open Staff Admin Operations →
            </button>
          </div>
        </div>
      </div>

      {/* Copyright & Nepal Legal strip */}
      <div className="border-t border-neutral-800/80 py-4 bg-neutral-950 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} My Mart Industries Pvt. Ltd. All rights reserved. Registered under Office of the Company Registrar, Government of Nepal (PAN: 601928374).
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Kathmandu</span>
            <span>·</span>
            <span>Lalitpur</span>
            <span>·</span>
            <span>Pokhara</span>
            <span>·</span>
            <span>Birgunj</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
