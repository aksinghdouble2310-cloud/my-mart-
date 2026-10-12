/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Storefront } from './components/retail/Storefront';
import { WholesaleQuickOrder } from './components/wholesale/WholesaleQuickOrder';
import { OrdersListView } from './components/orders/OrdersListView';
import { OffersView } from './components/retail/OffersView';
import { UserProfileRewards } from './components/profile/UserProfileRewards';
import { DeliveryAppView } from './components/delivery/DeliveryAppView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/retail/ProductDetailModal';
import { CartDrawer } from './components/retail/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { B2BVerificationModal } from './components/wholesale/B2BVerificationModal';
import { AiAssistantDrawer } from './components/ai/AiAssistantDrawer';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    role,
    activeTab,
    selectedProductDetail,
    setSelectedProductDetail,
    toastMessage,
  } = useApp();

  // Render appropriate view based on role and tab
  const renderMainView = () => {
    if (role === 'delivery') {
      return <DeliveryAppView />;
    }
    if (role === 'admin') {
      return <AdminDashboard />;
    }

    switch (activeTab) {
      case 'wholesale-quick':
        return <WholesaleQuickOrder />;
      case 'orders':
        return <OrdersListView />;
      case 'offers':
        return <OffersView />;
      case 'rewards':
        return <UserProfileRewards />;
      case 'home':
      case 'categories':
      default:
        return <Storefront />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Universal Navigation */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 pb-16">{renderMainView()}</main>

      {/* Reusable Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
      />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <B2BVerificationModal />
      <AiAssistantDrawer />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl border border-neutral-700 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Universal Commercial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
