import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  AlertOctagon,
  Navigation,
  KeyRound,
  ShieldCheck,
  DollarSign,
  Package,
} from 'lucide-react';
import { DELIVERY_FLEET_IMG } from '../../data/mockData';

export const DeliveryAppView: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [selectedOrderForOtp, setSelectedOrderForOtp] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [failedOrderModal, setFailedOrderModal] = useState<Order | null>(null);
  const [failedReason, setFailedReason] = useState('Customer unreachable / phone switched off');

  // Filter deliveries assigned to driver
  const assignedOrders = orders.filter(
    (o) => o.status !== 'cancelled' && o.status !== 'returned'
  );

  const completedToday = orders.filter((o) => o.status === 'delivered').length;
  const earningsToday = completedToday * 120 + 800; // Base rate + delivery fee

  const handleAdvanceStatus = (order: Order) => {
    if (order.status === 'confirmed') {
      updateOrderStatus(order.id, 'packed', 'Courier confirmed order is packed at depot');
    } else if (order.status === 'packed') {
      updateOrderStatus(order.id, 'dispatched', 'Loaded onto van at Balaju Depot');
    } else if (order.status === 'dispatched') {
      updateOrderStatus(order.id, 'out_for_delivery', 'Courier en route to customer location');
    } else if (order.status === 'out_for_delivery') {
      // Prompt for OTP
      setSelectedOrderForOtp(order);
      setOtpInput('');
      setOtpError(null);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForOtp) return;

    if (otpInput.trim() === selectedOrderForOtp.deliveryOtp) {
      updateOrderStatus(
        selectedOrderForOtp.id,
        'delivered',
        'Delivered successfully with OTP verification'
      );
      showToast(`Order #${selectedOrderForOtp.id} delivered! OTP verified.`);
      setSelectedOrderForOtp(null);
    } else {
      setOtpError('Invalid OTP code. Please ask the customer for their 4-digit SMS OTP.');
    }
  };

  const handleReportFailed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!failedOrderModal) return;

    updateOrderStatus(
      failedOrderModal.id,
      'dispatched',
      `Delivery attempt failed: ${failedReason}. Returned to Balaju Hub.`
    );
    showToast(`Order #${failedOrderModal.id} marked as Return-to-Hub: ${failedReason}`);
    setFailedOrderModal(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Courier Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={DELIVERY_FLEET_IMG}
            alt="Delivery Partner"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-neutral-900">Ramesh Thapa</h1>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Route 4 · Maharajgunj / Balaju
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Van: BA 2 PA 8920 (Electric Cargo) · Rating: 4.95 ★
            </p>
          </div>
        </div>

        {/* Online Status Toggle & Shift KPI */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-neutral-400 block">Today's Payout</span>
            <span className="text-base font-bold text-emerald-800 tabular-nums">
              Rs. {earningsToday.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              setIsOnline(!isOnline);
              showToast(isOnline ? 'Switched to Offline Mode' : 'You are now Online for Deliveries');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              isOnline
                ? 'bg-emerald-800 text-white'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400' : 'bg-neutral-500'
              }`}
            />
            <span>{isOnline ? 'Online (Accepting)' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 text-center">
          <span className="text-neutral-500 text-xs block">Assigned Today</span>
          <span className="text-xl font-bold text-neutral-900 tabular-nums">
            {assignedOrders.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200 text-center">
          <span className="text-neutral-500 text-xs block">Delivered</span>
          <span className="text-xl font-bold text-emerald-700 tabular-nums">
            {completedToday}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-200 text-center">
          <span className="text-neutral-500 text-xs block">Pending Dispatch</span>
          <span className="text-xl font-bold text-amber-600 tabular-nums">
            {assignedOrders.filter((o) => o.status !== 'delivered').length}
          </span>
        </div>
      </div>

      {/* Active Deliveries List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 flex items-center justify-between">
          <span>Active Route Delivery Stops ({assignedOrders.length})</span>
          <span className="text-xs text-neutral-500 font-normal">
            Sorted by Kathmandu Valley Proximity
          </span>
        </h2>

        {assignedOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center text-neutral-500 text-xs">
            No active deliveries assigned to your vehicle at this moment.
          </div>
        ) : (
          assignedOrders.map((order) => {
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs space-y-4 ${
                  isDelivered
                    ? 'border-neutral-200 bg-neutral-50/60 opacity-80'
                    : 'border-emerald-700/30'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">#{order.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          isDelivered
                            ? 'bg-neutral-200 text-neutral-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500">
                        {order.customerRole === 'wholesale' ? 'Kirana Wholesale Carton' : 'Retail Bag'}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 mt-0.5 block">
                      Slot: {order.deliverySlot}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block">Collect Amount:</span>
                    <span className="text-sm font-bold text-neutral-900 tabular-nums">
                      {order.paymentMethod === 'cod' ? (
                        <span className="text-rose-700">Rs. {order.total.toLocaleString()} (COD)</span>
                      ) : (
                        <span className="text-emerald-700">PAID ONLINE ✓</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Address & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-neutral-900 block">
                        {order.deliveryAddress.recipientName} ({order.deliveryAddress.label})
                      </span>
                      <p className="text-neutral-600 mt-0.5">
                        {order.deliveryAddress.streetAddress}, {order.deliveryAddress.ward}, {order.deliveryAddress.municipality}
                      </p>
                      {order.deliveryAddress.landmark && (
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Landmark: {order.deliveryAddress.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${order.deliveryAddress.phone}`}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Call +977 {order.deliveryAddress.phone}</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.municipality}, Nepal`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Map GPS</span>
                      </a>
                    </div>

                    <span className="text-[11px] text-neutral-400">
                      OTP for delivery: <strong className="text-neutral-700 font-mono">{order.deliveryOtp}</strong>
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="truncate pr-2">
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </span>
                  <span className="font-semibold text-neutral-800 shrink-0">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} packages
                  </span>
                </div>

                {/* Status Stepper Actions */}
                {!isDelivered && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => setFailedOrderModal(order)}
                      className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Report Delivery Issue / Reschedule
                    </button>

                    <button
                      onClick={() => handleAdvanceStatus(order)}
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      {order.status === 'confirmed' && <span>Pick Up from Balaju Depot →</span>}
                      {order.status === 'packed' && <span>Dispatch & Load Van →</span>}
                      {order.status === 'dispatched' && <span>Start Route Navigation →</span>}
                      {order.status === 'out_for_delivery' && (
                        <span>Verify Customer OTP & Handover ✓</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* OTP Handover Verification Modal */}
      {selectedOrderForOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-neutral-900 text-sm">
                  Customer Delivery OTP
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForOtp(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Please enter the 4-digit verification code provided by the customer at the delivery location:
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  setOtpError(null);
                }}
                placeholder="4-digit OTP (e.g. 7492)"
                className="w-full text-center text-2xl font-mono tracking-widest py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-emerald-700"
                autoFocus
                required
              />

              {otpError && (
                <p className="text-[11px] text-rose-600 font-medium text-center">
                  {otpError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForOtp(null)}
                  className="w-1/2 py-2 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Failed Delivery Modal */}
      {failedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 text-sm">
                Report Delivery Failure
              </h3>
              <button
                onClick={() => setFailedOrderModal(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <select
              value={failedReason}
              onChange={(e) => setFailedReason(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
            >
              <option value="Customer unreachable / phone switched off">Customer unreachable / phone switched off</option>
              <option value="Customer requested reschedule">Customer requested reschedule</option>
              <option value="Shop / Residence closed">Shop / Residence closed</option>
              <option value="Wrong address / Landmark not found">Wrong address / Landmark not found</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setFailedOrderModal(null)}
                className="w-1/2 py-2 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReportFailed}
                className="w-1/2 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Return to Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
