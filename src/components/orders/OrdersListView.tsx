import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Truck, Clock, ArrowRight, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

export const OrdersListView: React.FC = () => {
  const {
    orders,
    setSelectedTrackingOrderId,
    addToCart,
    setIsCartOpen,
    showToast,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Order History & Delivery Tracking
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time fulfillment tracking, OTP codes, and downloadable tax invoices
          </p>
        </div>
        <span className="text-xs font-semibold text-neutral-600 bg-neutral-200/80 px-3 py-1 rounded-full">
          {orders.length} total orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center text-neutral-500 text-xs">
          You haven't placed any orders yet. Browse our catalogue to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 hover:border-neutral-300 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900 font-mono">
                        #{order.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'out_for_delivery'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500">
                        {order.customerRole === 'wholesale' ? 'B2B Wholesale' : 'Retail'}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 mt-0.5 block">
                      Placed on {order.createdAt} · Slot: {order.deliverySlot}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block">Total Amount:</span>
                    <span className="text-sm font-bold text-neutral-900 tabular-nums">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <div className="flex items-center gap-2 overflow-x-auto max-w-xl py-1">
                    {order.items.map((i, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded-lg shrink-0"
                      >
                        <span className="font-semibold text-neutral-900">{i.quantity}x</span>
                        <span className="truncate max-w-[130px]">{i.product.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedTrackingOrderId(order.id)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Track Order & OTP →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
