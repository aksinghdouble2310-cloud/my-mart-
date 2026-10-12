import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Phone,
  FileText,
  RotateCcw,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { DELIVERY_FLEET_IMG } from '../../data/mockData';

interface OrderTrackingModalProps {
  orderId: string;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC = () => {
  const {
    selectedTrackingOrderId,
    setSelectedTrackingOrderId,
    orders,
    addToCart,
    requestReturn,
    setIsCartOpen,
    showToast,
  } = useApp();

  const [showInvoice, setShowInvoice] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Damaged packaging / Torn carton');

  if (!selectedTrackingOrderId) return null;

  const order = orders.find((o) => o.id === selectedTrackingOrderId);
  if (!order) return null;

  const statusSteps: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'packed', label: 'Packed & Weighed', icon: Package },
    { key: 'dispatched', label: 'Dispatched Hub', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { key: 'delivered', label: 'Delivered', icon: ShieldCheck },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'packed':
        return 1;
      case 'dispatched':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
      case 'returned':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.isWholesaleTier);
    });
    setSelectedTrackingOrderId(null);
    setIsCartOpen(true);
    showToast(`Reordered ${order.items.length} items to cart!`);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    requestReturn(order.id, returnReason);
    setShowReturnModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Order Tracking #{order.id}
              </h2>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full capitalize">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Placed on {order.createdAt} · {order.customerRole === 'wholesale' ? 'B2B Wholesale' : 'Retail'}
            </p>
          </div>
          <button
            onClick={() => setSelectedTrackingOrderId(null)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Visual Tracking Stepper */}
          <div className="bg-neutral-50/80 p-5 rounded-2xl border border-neutral-200">
            <div className="grid grid-cols-5 gap-2 relative">
              {statusSteps.map((s, idx) => {
                const Icon = s.icon;
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={s.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors mb-2 ${
                        isCurrent
                          ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                          : isPassed
                          ? 'bg-emerald-700 text-white'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold leading-tight line-clamp-2 ${
                        isPassed ? 'text-neutral-900' : 'text-neutral-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Delivery OTP & SLA Announcement */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="font-semibold text-neutral-800">Delivery Slot:</span>
                <span className="text-neutral-600">{order.deliverySlot}</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-lg">
                <span className="font-medium text-[11px]">Delivery OTP:</span>
                <span className="font-mono font-bold text-sm text-neutral-950 tracking-wider">
                  {order.deliveryOtp}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Driver & Destination Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Courier Profile */}
            {order.deliveryPartner && (
              <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-center gap-3.5">
                <img
                  src={DELIVERY_FLEET_IMG}
                  alt={order.deliveryPartner.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-emerald-300"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-neutral-900 text-xs truncate">
                      {order.deliveryPartner.name}
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                      Courier Partner
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    {order.deliveryPartner.vehiclePlate}
                  </p>
                  <a
                    href={`tel:${order.deliveryPartner.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline mt-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Driver (+977 {order.deliveryPartner.phone})</span>
                  </a>
                </div>
              </div>
            )}

            {/* Delivery Destination */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-white text-xs">
              <span className="font-semibold text-neutral-900 block mb-1">
                Delivering to: {order.deliveryAddress.label}
              </span>
              <p className="text-neutral-600">
                {order.deliveryAddress.recipientName} · +977 {order.deliveryAddress.phone}
              </p>
              <p className="text-neutral-500 mt-1">
                {order.deliveryAddress.streetAddress}, {order.deliveryAddress.ward}, {order.deliveryAddress.municipality}, {order.deliveryAddress.district}
              </p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-neutral-100/70 px-4 py-2 text-xs font-bold text-neutral-700">
              Purchased FMCG Items ({order.items.length})
            </div>
            <div className="divide-y divide-neutral-100 max-h-52 overflow-y-auto">
              {order.items.map((item, i) => {
                const price = item.isWholesaleTier
                  ? item.product.wholesalePrice
                  : item.product.retailPrice;
                return (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 object-cover rounded bg-neutral-100"
                      />
                      <div>
                        <span className="font-semibold text-neutral-900 block">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {item.quantity} x {item.isWholesaleTier ? 'Master Carton' : item.product.unit} @ Rs. {price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      Rs. {(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Total Strip */}
            <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 flex justify-between items-center text-xs">
              <span className="text-neutral-600">
                Payment: <strong className="text-neutral-900 uppercase">{order.paymentMethod.replace(/_/g, ' ')}</strong> ({order.paymentStatus})
              </span>
              <div className="text-right">
                <span className="text-xs text-neutral-500 mr-2">Net Paid Total:</span>
                <span className="text-sm font-bold text-emerald-950 tabular-nums">
                  Rs. {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Return Status if return requested */}
          {order.status === 'return_requested' && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Return Claim Under Quality Audit</span>
              </div>
              <p>Reason: {order.returnReason || 'Damaged goods reported'}. Our warehouse supervisor will verify within 24 hours.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvoice(!showInvoice)}
              className="px-3 py-2 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{showInvoice ? 'Hide Tax Invoice' : 'View Nepal Tax Invoice'}</span>
            </button>

            {order.status === 'delivered' && !order.returnReason && (
              <button
                onClick={() => setShowReturnModal(true)}
                className="px-3 py-2 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Request Return / Claim
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReorder}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder All Items</span>
            </button>
          </div>
        </div>

        {/* Printable Nepal VAT Invoice Modal View */}
        {showInvoice && (
          <div className="p-6 bg-white border-t-2 border-neutral-800 text-xs space-y-4">
            <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">MY MART INDUSTRIES PVT. LTD.</h3>
                <p className="text-neutral-500">Balaju Industrial District, Kathmandu, Nepal</p>
                <p className="text-neutral-600 font-mono">PAN / VAT: 601928374</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-neutral-900 block">TAX INVOICE / कर बीजक</span>
                <span className="font-mono text-neutral-600 block">Inv #: INV-2026-{order.id.replace(/\D/g, '')}</span>
                <span className="text-neutral-500 block">Date: {order.createdAt}</span>
              </div>
            </div>

            <div className="flex justify-between text-neutral-700 py-1 border-b border-neutral-100">
              <div>
                <span className="font-bold block">Buyer Name: {order.customerName}</span>
                <span>Address: {order.deliveryAddress.streetAddress}, {order.deliveryAddress.municipality}</span>
              </div>
              <div className="text-right">
                <span className="block font-mono">Payment: {order.paymentMethod.toUpperCase()}</span>
                <span>Terms: {order.paymentStatus === 'invoiced_30_days' ? 'Net 30 Days' : 'Immediate'}</span>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-600 font-bold">
                  <th className="py-1">Description</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Rate</th>
                  <th className="py-1 text-right">Taxable Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5">{it.product.name} ({it.product.sku})</td>
                    <td className="py-1.5 text-center">{it.quantity}</td>
                    <td className="py-1.5 text-right tabular-nums">
                      Rs. {(it.isWholesaleTier ? it.product.wholesalePrice : it.product.retailPrice).toLocaleString()}
                    </td>
                    <td className="py-1.5 text-right tabular-nums font-medium">
                      Rs. {(
                        (it.isWholesaleTier ? it.product.wholesalePrice : it.product.retailPrice) * it.quantity
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-neutral-900 text-sm">
              <span>Grand Total with 13% VAT:</span>
              <span className="tabular-nums text-emerald-900">Rs. {order.total.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-neutral-400 italic text-center">
              This is a computer-generated tax invoice verified under Inland Revenue Department (IRD) regulations.
            </p>
          </div>
        )}

        {/* Return Claim Form Drawer/Modal */}
        {showReturnModal && (
          <div className="p-6 bg-rose-50/50 border-t border-rose-200 space-y-3 text-xs">
            <h4 className="font-bold text-rose-900 text-sm">File Return / RMA Claim</h4>
            <p className="text-neutral-600">
              Please specify the reason for returning products from Order #{order.id}:
            </p>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
            >
              <option value="Damaged packaging / Torn carton">Damaged packaging / Torn carton</option>
              <option value="Mismatched item delivered">Mismatched item delivered</option>
              <option value="Quality defect / Seal broken">Quality defect / Seal broken</option>
              <option value="Expired or near expiry batch">Expired or near expiry batch</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                Submit Return Claim
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
