import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Address, PaymentMethod } from '../../types';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  Truck,
  Building2,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { NEPAL_PROVINCES, NEPAL_POPULAR_DISTRICTS } from '../../data/mockData';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    user,
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartVat,
    cartTotal,
    placeOrder,
    role,
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedAddress, setSelectedAddress] = useState<Address>(user.addresses[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(
    'Today 05:00 PM - 07:00 PM (Express Slot)'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    role === 'wholesale' ? 'wholesale_credit' : 'esewa'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // New Address Form State
  const [newLabel, setNewLabel] = useState('Shop / Warehouse');
  const [newRecipient, setNewRecipient] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [newProvince, setNewProvince] = useState(NEPAL_PROVINCES[0]);
  const [newDistrict, setNewDistrict] = useState('Kathmandu');
  const [newMunicipality, setNewMunicipality] = useState('Kathmandu Metropolitan City');
  const [newWard, setNewWard] = useState('Ward 04');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Address = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      recipientName: newRecipient,
      phone: newPhone,
      province: newProvince,
      district: newDistrict,
      municipality: newMunicipality,
      ward: newWard,
      streetAddress: newStreet,
      landmark: newLandmark,
    };
    setSelectedAddress(created);
    setIsAddingNewAddress(false);
  };

  const handlePlaceOrder = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      placeOrder({
        paymentMethod,
        deliverySlot: selectedSlot,
        deliveryAddress: selectedAddress,
      });
      setIsCheckoutOpen(false);
    }, 1200);
  };

  const deliverySlots = [
    { id: 'express', title: 'Express 2-Hour Slot', time: 'Within 2 hours', note: 'Kathmandu Valley Central Zones' },
    { id: 'evening', title: 'Today Evening', time: '05:00 PM - 08:00 PM', note: 'All Valley Municipalities' },
    { id: 'morning', title: 'Tomorrow Morning', time: '08:00 AM - 11:00 AM', note: 'Standard & Bulk Logistics' },
  ];

  const paymentOptions: { id: PaymentMethod; title: string; desc: string; icon: string }[] = [
    {
      id: 'esewa',
      title: 'eSewa Mobile Wallet',
      desc: 'Pay securely using eSewa account or eSewa QR',
      icon: '🟢',
    },
    {
      id: 'khalti',
      title: 'Khalti Digital Wallet',
      desc: 'Instant payment via Khalti app & OTP verification',
      icon: '🟣',
    },
    {
      id: 'fonepay',
      title: 'Fonepay Interbank QR',
      desc: 'Scan with any Nepal bank mobile banking app',
      icon: '🔴',
    },
    {
      id: 'cod',
      title: 'Cash on Delivery (COD)',
      desc: 'Pay physical cash or card upon delivery inspection',
      icon: '💵',
    },
    {
      id: 'wholesale_credit',
      title: 'B2B 30-Day Credit Terms',
      desc: `Invoiced on PAN #${user.b2bProfile?.panNumber || '601928374'} (Approved Kirana Credit)`,
      icon: '🏢',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Secure Order Checkout</h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
              <span>Step {step} of 3</span>
              <span>·</span>
              <span>
                {step === 1 ? 'Delivery Address' : step === 2 ? 'Schedule & Slot' : 'Payment & Confirm'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900 text-sm">Select Delivery Location</h3>
                {!isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {!isAddingNewAddress ? (
                <div className="grid grid-cols-1 gap-3">
                  {user.addresses.map((addr) => {
                    const isSelected = selectedAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-neutral-900 text-sm">{addr.label}</span>
                          {isSelected && (
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-700 font-medium">
                          {addr.recipientName} · +977 {addr.phone}
                        </p>
                        <p className="text-neutral-500 mt-1">
                          {addr.streetAddress}, {addr.ward}, {addr.municipality}, {addr.district} ({addr.province})
                        </p>
                        {addr.landmark && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Landmark: {addr.landmark}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <form onSubmit={handleSaveAddress} className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Address Label</label>
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="e.g. Balaju Kirana Branch"
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Phone Number (+977)</label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="98xxxxxxxx"
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Province</label>
                      <select
                        value={newProvince}
                        onChange={(e) => {
                          setNewProvince(e.target.value);
                          setNewDistrict(NEPAL_POPULAR_DISTRICTS[e.target.value]?.[0] || 'Kathmandu');
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      >
                        {NEPAL_PROVINCES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">District</label>
                      <input
                        type="text"
                        value={newDistrict}
                        onChange={(e) => setNewDistrict(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Municipality / City</label>
                      <input
                        type="text"
                        value={newMunicipality}
                        onChange={(e) => setNewMunicipality(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium text-neutral-700 block mb-1">Ward Number</label>
                      <input
                        type="text"
                        value={newWard}
                        onChange={(e) => setNewWard(e.target.value)}
                        placeholder="e.g. Ward 03"
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">Street / Chowk / Tole</label>
                    <input
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. Ring Road, Near Bhatbhateni Supermarket"
                      className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Save & Use Address
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900 text-sm">Select Preferred Delivery Schedule</h3>
              <div className="grid grid-cols-1 gap-3">
                {deliverySlots.map((slot) => {
                  const isSelected = selectedSlot === `${slot.title} (${slot.time})`;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(`${slot.title} (${slot.time})`)}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-900 text-sm">{slot.title}</span>
                        <span className="font-semibold text-emerald-800">{slot.time}</span>
                      </div>
                      <p className="text-neutral-500">{slot.note}</p>
                    </div>
                  );
                })}
              </div>

              {/* Order Items Summary Preview */}
              <div className="mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-700 block mb-2">
                  Order Summary ({cart.length} distinct products)
                </span>
                <div className="space-y-1.5 text-xs text-neutral-600 max-h-32 overflow-y-auto">
                  {cart.map((i) => (
                    <div key={i.product.id} className="flex justify-between">
                      <span className="truncate pr-2">
                        {i.quantity}x {i.product.name} ({i.isWholesaleTier ? 'Wholesale ctn' : 'Retail'})
                      </span>
                      <span className="tabular-nums font-medium text-neutral-900 shrink-0">
                        Rs. {(
                          (i.isWholesaleTier ? i.product.wholesalePrice : i.product.retailPrice) *
                          i.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900 text-sm">Select Nepal Payment Gateway</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {paymentOptions.map((opt) => {
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <span className="text-xl shrink-0">{opt.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-900 text-sm">{opt.title}</span>
                          {isSelected && (
                            <span className="text-[11px] font-semibold text-emerald-800">Selected ✓</span>
                          )}
                        </div>
                        <p className="text-neutral-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulated QR Code for Fonepay / eSewa */}
              {(paymentMethod === 'fonepay' || paymentMethod === 'esewa') && (
                <div className="p-4 rounded-xl bg-neutral-900 text-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold block text-emerald-300">
                      Fonepay / eSewa Instant QR Available
                    </span>
                    <p className="text-neutral-400 text-[11px] mt-0.5">
                      Or continue to pay automatically through sandbox authorization.
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-lg p-1.5 flex items-center justify-center text-neutral-900 shrink-0">
                    <QrCode className="w-full h-full text-neutral-900" />
                  </div>
                </div>
              )}

              {/* Order Total Breakdown */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount:</span>
                    <span className="font-semibold tabular-nums">
                      - Rs. {cartDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600">Freight & Delivery:</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    {cartDeliveryFee === 0 ? 'FREE' : `Rs. ${cartDeliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Nepal VAT (13%):</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    Rs. {cartVat.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-neutral-900 border-t border-neutral-200 pt-1.5">
                  <span>Payable Total:</span>
                  <span className="text-emerald-900 tabular-nums">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => prev + 1)}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessingPayment}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <span>Authorizing Order with Warehouse...</span>
              ) : (
                <span>Confirm & Place Order (Rs. {cartTotal.toLocaleString()})</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
