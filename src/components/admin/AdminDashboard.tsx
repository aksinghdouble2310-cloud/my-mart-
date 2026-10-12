import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Order, OrderStatus } from '../../types';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Building2,
  AlertTriangle,
  Users,
  CheckCircle,
  Truck,
  Plus,
  Edit2,
  DollarSign,
  FileText,
  Search,
  Filter,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { WHOLESALE_WAREHOUSE_IMG, PRODUCT_STAPLES_IMG } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    updateProductStock,
    updateProductPrices,
    addProduct,
    orders,
    updateOrderStatus,
    processReturnDecision,
    user,
    updateUser,
    showToast,
  } = useApp();

  const [adminTab, setAdminTab] = useState<
    'overview' | 'orders' | 'inventory' | 'b2b-accounts' | 'returns'
  >('overview');

  const [inventorySearch, setInventorySearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [newRetailPriceVal, setNewRetailPriceVal] = useState<number>(0);
  const [newWholesalePriceVal, setNewWholesalePriceVal] = useState<number>(0);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNepaliName, setNewProdNepaliName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('My Mart Staples');
  const [newProdCategory, setNewProdCategory] = useState('rice-grains');
  const [newProdUnit, setNewProdUnit] = useState('1 kg Pouch');
  const [newProdRetail, setNewProdRetail] = useState(150);
  const [newProdWholesale, setNewProdWholesale] = useState(2800);
  const [newProdCartonUnits, setNewProdCartonUnits] = useState(20);
  const [newProdStock, setNewProdStock] = useState(200);

  // Filtered orders & inventory
  const filteredInventory = products.filter(
    (p) =>
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // KPIs
  const totalGrossSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;
  const lowStockCount = products.filter((p) => p.stockCount < 50).length;
  const wholesaleSales = orders
    .filter((o) => o.customerRole === 'wholesale')
    .reduce((sum, o) => sum + o.total, 0);
  const retailSales = totalGrossSales - wholesaleSales;

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setNewStockVal(p.stockCount);
    setNewRetailPriceVal(p.retailPrice);
    setNewWholesalePriceVal(p.wholesalePrice);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProductStock(editingProduct.id, newStockVal);
    updateProductPrices(editingProduct.id, newRetailPriceVal, newWholesalePriceVal);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `prod-${Date.now()}`,
      sku: newProdSku || `MM-${newProdCategory.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newProdName,
      nepaliName: newProdNepaliName || newProdName,
      brand: newProdBrand,
      category: newProdCategory,
      subcategory: 'General Grocery',
      image: PRODUCT_STAPLES_IMG,
      description: `Premium quality FMCG staple distributed by My Mart Industries Pvt. Ltd.`,
      unit: newProdUnit,
      retailPrice: Number(newProdRetail),
      wholesalePrice: Number(newProdWholesale),
      cartonUnits: Number(newProdCartonUnits),
      minWholesaleOrderQty: 2,
      inStock: newProdStock > 0,
      stockCount: Number(newProdStock),
      warehouseLocation: 'Balaju Central Depot, Kathmandu',
      rating: 4.8,
      reviewCount: 12,
      tags: ['Verified Genuine', 'FMCG'],
      origin: 'Nepal',
      vatPercent: 13,
    };
    addProduct(created);
    setShowAddProductModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span>My Mart Industries Pvt. Ltd. Operations</span>
            <span>·</span>
            <span>Kathmandu Balaju Head Office</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Central Management & Fulfillment Console
          </h1>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center p-1 bg-neutral-200/80 rounded-xl overflow-x-auto max-w-full text-xs font-semibold">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'overview' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            Overview & KPIs
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'orders' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            Orders & Dispatch ({orders.length})
          </button>
          <button
            onClick={() => setAdminTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'inventory' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            Inventory & Catalog ({products.length})
          </button>
          <button
            onClick={() => setAdminTab('b2b-accounts')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'b2b-accounts' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            B2B Kirana Accounts
          </button>
          <button
            onClick={() => setAdminTab('returns')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              adminTab === 'returns' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
            }`}
          >
            RMA Returns & Claims
          </button>
        </div>
      </div>

      {/* Overview Analytics View */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <span className="text-xs font-medium text-neutral-500 block">Total Gross Sales</span>
              <div className="text-2xl font-bold text-neutral-900 tabular-nums mt-1">
                Rs. {totalGrossSales.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                +18.4% month-over-month
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <span className="text-xs font-medium text-neutral-500 block">B2B Wholesale Share</span>
              <div className="text-2xl font-bold text-emerald-800 tabular-nums mt-1">
                Rs. {wholesaleSales.toLocaleString()}
              </div>
              <span className="text-[11px] text-neutral-500 block mt-1">
                {totalGrossSales > 0 ? Math.round((wholesaleSales / totalGrossSales) * 100) : 0}% of total volume
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <span className="text-xs font-medium text-neutral-500 block">Pending Order Dispatch</span>
              <div className="text-2xl font-bold text-amber-600 tabular-nums mt-1">
                {pendingOrdersCount} orders
              </div>
              <span className="text-[11px] text-neutral-500 block mt-1">
                Across Kathmandu, Lalitpur & Birgunj
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <span className="text-xs font-medium text-neutral-500 block">Low Stock Alerts</span>
              <div className="text-2xl font-bold text-rose-600 tabular-nums mt-1">
                {lowStockCount} items
              </div>
              <span className="text-[11px] text-neutral-500 block mt-1">
                Below replenishment threshold
              </span>
            </div>
          </div>

          {/* Analytics Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Distribution Card */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm mb-4">
                Channel Revenue Distribution (NPR)
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-neutral-700">
                      B2B Kirana Wholesale (Master Cartons)
                    </span>
                    <span className="font-bold tabular-nums">
                      Rs. {wholesaleSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-800 h-full rounded-full"
                      style={{
                        width: `${
                          totalGrossSales > 0
                            ? (wholesaleSales / totalGrossSales) * 100
                            : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-neutral-700">
                      B2C Retail Groceries (Doorstep Family Packs)
                    </span>
                    <span className="font-bold tabular-nums">
                      Rs. {retailSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{
                        width: `${
                          totalGrossSales > 0 ? (retailSales / totalGrossSales) * 100 : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Warehouse Hubs Overview */}
              <div className="mt-6 pt-5 border-t border-neutral-100 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-[11px] text-neutral-400 block">Balaju Depot</span>
                  <span className="font-bold text-neutral-800 block mt-0.5">85% Capacity</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-[11px] text-neutral-400 block">Birgunj Hub</span>
                  <span className="font-bold text-neutral-800 block mt-0.5">72% Capacity</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-[11px] text-neutral-400 block">Pokhara Center</span>
                  <span className="font-bold text-neutral-800 block mt-0.5">60% Capacity</span>
                </div>
              </div>
            </div>

            {/* Top Fast-Moving FMCG items */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm mb-4">
                Fast-Moving FMCG Inventory Status
              </h3>
              <div className="divide-y divide-neutral-100 text-xs">
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded object-cover bg-neutral-100"
                      />
                      <div>
                        <span className="font-semibold text-neutral-900 block truncate max-w-[200px]">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {p.sku} · {p.warehouseLocation.split(',')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900 tabular-nums">
                        {p.stockCount} in stock
                      </span>
                      <span className="text-[10px] text-emerald-700 block">
                        Wholesale: Rs. {p.wholesalePrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Management View */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-bold text-neutral-900 text-sm">
              Live Order Processing & Fulfillment Pipeline ({orders.length})
            </h3>
            <span className="text-xs text-neutral-500">
              Auto-syncs with Delivery Fleet
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100/70 text-neutral-600 font-semibold border-b border-neutral-200 text-[11px] uppercase">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4 text-right">Net Value</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-center">Fulfillment Status</th>
                  <th className="py-3 px-4 text-center">Change State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-neutral-900 font-mono block">
                        #{o.id}
                      </span>
                      <span className="text-[11px] text-neutral-400 block">{o.createdAt}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800 block">
                        {o.customerName}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        +977 {o.customerPhone}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          o.customerRole === 'wholesale'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {o.customerRole === 'wholesale' ? 'B2B Wholesale' : 'Retail'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-700">
                      {o.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-neutral-900 tabular-nums">
                      Rs. {o.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-semibold text-neutral-600">
                      {o.paymentMethod.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          o.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'out_for_delivery'
                            ? 'bg-blue-100 text-blue-800'
                            : o.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(o.id, e.target.value as OrderStatus)
                        }
                        className="text-xs bg-white border border-neutral-300 rounded px-2 py-1 font-medium cursor-pointer"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory & Catalog Management View */}
      {adminTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search inventory by title, SKU, or brand..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FMCG Product</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100/70 text-neutral-600 font-semibold border-b border-neutral-200 text-[11px] uppercase">
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Depot Location</th>
                    <th className="py-3 px-4 text-right">Retail (1 Unit)</th>
                    <th className="py-3 px-4 text-right">Wholesale Carton</th>
                    <th className="py-3 px-4 text-center">Carton Packaging</th>
                    <th className="py-3 px-4 text-center">Stock Level</th>
                    <th className="py-3 px-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredInventory.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded bg-neutral-100"
                          />
                          <div>
                            <span className="font-semibold text-neutral-900 block truncate max-w-[200px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              SKU: {p.sku} · {p.brand}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{p.warehouseLocation}</td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 tabular-nums">
                        Rs. {p.retailPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-800 tabular-nums">
                        Rs. {p.wholesalePrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-neutral-700">
                        {p.cartonUnits} pcs / ctn
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-bold tabular-nums px-2 py-0.5 rounded text-[11px] ${
                            p.stockCount < 50
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stockCount} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-semibold text-[11px] cursor-pointer"
                        >
                          Edit Stock/Price
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* B2B Kirana Accounts Management View */}
      {adminTab === 'b2b-accounts' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-2xs">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm">
              Approved Wholesale Retailers & Kirana Partners
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manage revolving credit limits, 30-day payment authorization, and IRD PAN verification status.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
            <div className="p-4 bg-neutral-50 flex items-center justify-between border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                  SK
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">
                    {user.b2bProfile?.companyName || 'Shrestha Kirana & General Store'}
                  </h4>
                  <p className="text-neutral-500 font-mono">
                    PAN: {user.b2bProfile?.panNumber || '601928374'} · Type: {user.b2bProfile?.businessType || 'Kirana Store'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Active & Verified
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
              <div>
                <span className="text-neutral-500 block">Total Credit Line:</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  Rs. {user.b2bProfile?.creditLimit.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Used Credit Balance:</span>
                <span className="text-base font-bold text-amber-700 tabular-nums">
                  Rs. {user.b2bProfile?.usedCredit.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Remaining Available:</span>
                <span className="text-base font-bold text-emerald-800 tabular-nums">
                  Rs. {((user.b2bProfile?.creditLimit || 0) - (user.b2bProfile?.usedCredit || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-neutral-50/50 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-600">
                Payment Terms: <strong>30-Day Revolving Invoice</strong>
              </span>
              <button
                onClick={() => {
                  updateUser({
                    b2bProfile: user.b2bProfile
                      ? { ...user.b2bProfile, creditLimit: (user.b2bProfile.creditLimit || 250000) + 50000 }
                      : undefined,
                  });
                  showToast('Credit limit upgraded by Rs. 50,000!');
                }}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold cursor-pointer"
              >
                + Expand Credit Limit by Rs. 50k
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Returns & RMA Claims View */}
      {adminTab === 'returns' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm">
              Customer Quality Claims & RMA Returns Queue
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review damaged or mismatched FMCG goods reported by retail and wholesale clients.
            </p>
          </div>

          <div className="space-y-3">
            {orders.filter((o) => o.status === 'return_requested' || o.status === 'returned').length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl">
                No active return claims pending review. All recent deliveries verified satisfactory!
              </div>
            ) : (
              orders
                .filter((o) => o.status === 'return_requested' || o.status === 'returned')
                .map((ro) => (
                  <div key={ro.id} className="p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-900">Order #{ro.id}</span>
                      <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        {ro.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-neutral-600">
                      Customer: {ro.customerName} · Claim Reason: <strong>{ro.returnReason || 'Damaged carton'}</strong>
                    </p>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => processReturnDecision(ro.id, 'rejected')}
                        className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded font-semibold cursor-pointer"
                      >
                        Decline Claim
                      </button>
                      <button
                        onClick={() => processReturnDecision(ro.id, 'approved')}
                        className="px-4 py-1 bg-emerald-800 text-white rounded font-semibold cursor-pointer"
                      >
                        Approve RMA & Refund Credit
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 text-xs">
            <h3 className="font-bold text-neutral-900 text-sm">
              Adjust Stock & Pricing: {editingProduct.name}
            </h3>

            <form onSubmit={handleSaveProductEdit} className="space-y-3">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Stock Count (Units):</label>
                <input
                  type="number"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Retail Price (NPR):</label>
                <input
                  type="number"
                  value={newRetailPriceVal}
                  onChange={(e) => setNewRetailPriceVal(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Wholesale Carton Price (NPR):</label>
                <input
                  type="number"
                  value={newWholesalePriceVal}
                  onChange={(e) => setNewWholesalePriceVal(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 text-xs">
            <h3 className="font-bold text-neutral-900 text-sm">
              Add New FMCG Grocery Product
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Product Title (English)</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Current Extra Spicy Instant Noodles"
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Nepali Title</label>
                  <input
                    type="text"
                    value={newProdNepaliName}
                    onChange={(e) => setNewProdNepaliName(e.target.value)}
                    placeholder="e.g. करेन्ट चाउचाउ"
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                  >
                    <option value="rice-grains">Rice & Grains</option>
                    <option value="cooking-oil">Cooking Oil & Ghee</option>
                    <option value="pulses-lentils">Pulses & Lentils</option>
                    <option value="noodles-snacks">Noodles & Snacks</option>
                    <option value="tea-beverages">Tea & Beverages</option>
                    <option value="cleaning-household">Cleaning & Household</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Retail Unit</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="e.g. 1 kg Pouch or 75g Pack"
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Retail (Rs.)</label>
                  <input
                    type="number"
                    value={newProdRetail}
                    onChange={(e) => setNewProdRetail(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Wholesale (Rs.)</label>
                  <input
                    type="number"
                    value={newProdWholesale}
                    onChange={(e) => setNewProdWholesale(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Carton Units</label>
                  <input
                    type="number"
                    value={newProdCartonUnits}
                    onChange={(e) => setNewProdCartonUnits(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Add Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
