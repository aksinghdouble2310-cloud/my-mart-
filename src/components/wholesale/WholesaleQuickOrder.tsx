import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Table,
  Search,
  Filter,
  Package,
  Plus,
  Minus,
  FileSpreadsheet,
  Upload,
  RotateCcw,
  ShoppingBag,
  Building2,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';
import { WHOLESALE_WAREHOUSE_IMG } from '../../data/mockData';

export const WholesaleQuickOrder: React.FC = () => {
  const {
    products,
    addToCart,
    user,
    setIsB2BRegisterOpen,
    showToast,
    setIsCartOpen,
  } = useApp();

  const [tableSearch, setTableSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCsvImportModal, setShowCsvImportModal] = useState(false);
  const [csvRawText, setCsvRawText] = useState(
    `MM-RICE-BAS-25, 5\nMM-OIL-DHARA-15L, 3\nMM-NOOD-WAI-30, 10\nMM-DAL-MUS-30, 2`
  );

  const categories = [
    { id: 'all', label: 'All Wholesale FMCG' },
    { id: 'rice-grains', label: 'Rice & Grains' },
    { id: 'cooking-oil', label: 'Cooking Oil & Ghee' },
    { id: 'pulses-lentils', label: 'Pulses & Lentils' },
    { id: 'noodles-snacks', label: 'Noodles & Snacks' },
    { id: 'tea-beverages', label: 'Tea & Beverages' },
    { id: 'cleaning-household', label: 'Hygiene & Cleaning' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesQuery =
      p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleQtyChange = (productId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleApplyMoq = (product: Product) => {
    handleQtyChange(product.id, product.minWholesaleOrderQty || 2);
  };

  // Calculate batch order sum for currently populated rows
  const activeOrderEntries = Object.entries(quantities).filter(([_, qty]) => qty > 0);
  const batchTotal = activeOrderEntries.reduce((sum, [pId, qty]) => {
    const prod = products.find((p) => p.id === pId);
    return sum + (prod ? prod.wholesalePrice * qty : 0);
  }, 0);
  const batchCartonCount = activeOrderEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  const handleAddAllToCart = () => {
    if (activeOrderEntries.length === 0) {
      showToast('Please specify carton quantities for at least one item');
      return;
    }

    activeOrderEntries.forEach(([pId, qty]) => {
      const prod = products.find((p) => p.id === pId);
      if (prod) {
        addToCart(prod, qty, true);
      }
    });

    setQuantities({});
    showToast(`Added ${batchCartonCount} wholesale cartons to bulk cart!`);
    setIsCartOpen(true);
  };

  const handleRepeatLastOrder = () => {
    // Populate quantities from top FMCG staples
    const template: Record<string, number> = {
      'prod-001': 5, // Basmati Rice 25kg
      'prod-002': 3, // Mustard oil 15L
      'prod-004': 10, // Wai Wai chicken cartons
      'prod-006': 3, // Musuro dal 30kg
    };
    setQuantities(template);
    showToast('Loaded Last Order template (4 FMCG lines)');
  };

  const handleProcessCsv = () => {
    const lines = csvRawText.split('\n');
    let importedCount = 0;
    const newQtyState = { ...quantities };

    lines.forEach((line) => {
      const parts = line.split(',').map((s) => s.trim());
      if (parts.length >= 2) {
        const [sku, qtyStr] = parts;
        const matched = products.find(
          (p) => p.sku.toLowerCase() === sku.toLowerCase()
        );
        const parsedQty = parseInt(qtyStr, 10);
        if (matched && !isNaN(parsedQty) && parsedQty > 0) {
          newQtyState[matched.id] = parsedQty;
          importedCount++;
        }
      }
    });

    setQuantities(newQtyState);
    setShowCsvImportModal(false);
    showToast(`Imported ${importedCount} items from CSV manifest`);
  };

  const handleExportSampleCsv = () => {
    const sample = `SKU,Quantity\nMM-RICE-BAS-25,5\nMM-OIL-DHARA-15L,3\nMM-NOOD-WAI-30,10\nMM-DAL-MUS-30,2\nMM-GHEE-HIM-500,4`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MyMart_BulkOrder_Template.csv';
    a.click();
    showToast('Downloaded sample wholesale order CSV template');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* B2B Banner Header */}
      <div className="rounded-2xl bg-neutral-900 text-white overflow-hidden border border-neutral-800 shadow-md relative">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <Building2 className="w-4 h-4" />
              <span>Kirana Store & Institutional Bulk Procurement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              B2B Wholesale Quick-Order Matrix
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Order dozens of FMCG staples, master cartons, and 25kg sacks in seconds. Real-time factory pricing, inventory reservation, and 30-day invoice terms for verified PAN accounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              onClick={handleRepeatLastOrder}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat Last Order</span>
            </button>
            <button
              onClick={() => setShowCsvImportModal(true)}
              className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Credit & Terms Alert Strip */}
      {user.b2bProfile && (
        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              PAN
            </div>
            <div>
              <span className="font-bold text-neutral-900 block">
                {user.b2bProfile.companyName} (PAN: {user.b2bProfile.panNumber})
              </span>
              <span className="text-neutral-500">
                Payment Terms: Net 30 Days · Credit Limit: Rs. {user.b2bProfile.creditLimit.toLocaleString()} (Available: Rs. {(user.b2bProfile.creditLimit - user.b2bProfile.usedCredit).toLocaleString()})
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsB2BRegisterOpen(true)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
          >
            Manage B2B Credit Profile →
          </button>
        </div>
      )}

      {/* Controls Toolbar: Search & Category tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedCat === c.id
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder="Filter by SKU or Product name..."
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* High-Productivity Spreadsheet Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-100/80 text-neutral-600 font-semibold border-b border-neutral-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-4">Master Packaging</th>
                <th className="py-3 px-4 text-right">Wholesale Price</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-center">MOQ</th>
                <th className="py-3 px-4 text-center">Order Cartons</th>
                <th className="py-3 px-4 text-right">Line Total</th>
                <th className="py-3 px-4 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80">
              {filteredProducts.map((p) => {
                const currentQty = quantities[p.id] || 0;
                const lineTotal = p.wholesalePrice * currentQty;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-neutral-50/80 transition-colors ${
                      currentQty > 0 ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    {/* Product & SKU */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded bg-neutral-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-neutral-900 block truncate max-w-[220px]">
                            {p.name}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500 block">
                            SKU: {p.sku} · {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Packaging */}
                    <td className="py-3 px-4 text-neutral-700">
                      <span className="font-medium block">
                        {p.cartonUnits} pcs / Master Carton
                      </span>
                      <span className="text-[10px] text-neutral-400 block">
                        Retail pack: {p.unit}
                      </span>
                    </td>

                    {/* Wholesale Price */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-neutral-900 tabular-nums">
                        Rs. {p.wholesalePrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        per carton
                      </span>
                    </td>

                    {/* Available Stock */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-semibold tabular-nums ${
                          p.stockCount < 20 ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {p.stockCount} ctn
                      </span>
                      <span className="text-[10px] text-neutral-400 block truncate">
                        {p.warehouseLocation.split(',')[0]}
                      </span>
                    </td>

                    {/* MOQ */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-neutral-100 text-neutral-700 font-medium px-2 py-0.5 rounded text-[11px] tabular-nums">
                        {p.minWholesaleOrderQty || 2} ctn
                      </span>
                    </td>

                    {/* Order Cartons Input */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => handleQtyChange(p.id, currentQty - 1)}
                          className="px-2 py-1 hover:bg-neutral-100 text-neutral-600 font-bold transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentQty === 0 ? '' : currentQty}
                          placeholder="0"
                          onChange={(e) =>
                            handleQtyChange(p.id, parseInt(e.target.value, 10) || 0)
                          }
                          className="w-12 text-center text-xs font-semibold tabular-nums text-neutral-900 focus:outline-hidden py-1 border-x border-neutral-200"
                        />
                        <button
                          onClick={() => handleQtyChange(p.id, currentQty + 1)}
                          className="px-2 py-1 hover:bg-neutral-100 text-neutral-600 font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Line Total */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-neutral-900 tabular-nums">
                        Rs. {lineTotal.toLocaleString()}
                      </span>
                    </td>

                    {/* Quick Action */}
                    <td className="py-3 px-4 text-center">
                      {currentQty === 0 ? (
                        <button
                          onClick={() => handleApplyMoq(p)}
                          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                        >
                          Apply MOQ ({p.minWholesaleOrderQty || 2})
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart(p, currentQty, true);
                            handleQtyChange(p.id, 0);
                          }}
                          className="px-2.5 py-1 bg-emerald-800 text-white rounded text-[11px] font-semibold hover:bg-emerald-900 transition-colors cursor-pointer"
                        >
                          Add Line
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Batch Total & Bulk Add CTA */}
        <div className="p-4 sm:p-6 bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block">Selected Items:</span>
              <span className="font-bold text-sm text-white tabular-nums">
                {activeOrderEntries.length} lines ({batchCartonCount} cartons)
              </span>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div>
              <span className="text-neutral-400 block">Wholesale Batch Total:</span>
              <span className="font-bold text-lg text-emerald-400 tabular-nums">
                Rs. {batchTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {batchTotal > 0 && (
              <button
                onClick={() => setQuantities({})}
                className="px-3 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Clear Quantities
              </button>
            )}
            <button
              onClick={handleAddAllToCart}
              disabled={activeOrderEntries.length === 0}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Bulk Cart (Rs. {batchTotal.toLocaleString()})</span>
            </button>
          </div>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showCsvImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 text-sm">
                Paste / Import Bulk CSV Order
              </h3>
              <button
                onClick={() => setShowCsvImportModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Format: <code className="bg-neutral-100 px-1 py-0.5 rounded">SKU, Quantity</code> (one product per row).
            </p>
            <textarea
              rows={6}
              value={csvRawText}
              onChange={(e) => setCsvRawText(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-800 focus:outline-hidden focus:border-emerald-700"
            />
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleExportSampleCsv}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCsvImportModal(false)}
                  className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessCsv}
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  Process & Populate Matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
