import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Save, FileText, Package, Hash, DollarSign, ChevronDown } from 'lucide-react';

interface LineItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const MOCK_PRODUCTS = [
  { id: '1', name: 'Software License', price: 1500 },
  { id: '2', name: 'Cloud Server (Monthly)', price: 45 },
  { id: '3', name: 'UI/UX Design Kit', price: 299 },
  { id: '4', name: 'Consulting Hour', price: 120 },
];

export const InvoiceForm = () => {
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', productId: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-fetch price if product changes
        if (field === 'productId') {
          const product = MOCK_PRODUCTS.find(p => p.id === value);
          if (product) {
            updatedItem.unitPrice = product.price;
          }
        }
        
        // Recalculate total
        updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        return updatedItem;
      }
      return item;
    }));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FileText className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Fatura Oluştur</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Yeni Fatura Detayları</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-1">Total Amount</span>
            <span className="text-2xl font-black text-white tracking-tighter">${grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="col-span-5">
                <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2 block ml-1">Ürün / Hizmet</label>
                <div className="relative">
                  <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(item.id, 'productId', e.target.value)}
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white/80 focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Ürün Seçin...</option>
                    {MOCK_PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2 block ml-1">Miktar</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white/80 focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2 block ml-1">Birim Fiyat</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white/80 focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2 block ml-1">Toplam</label>
                <div className="w-full bg-white/[0.03] border border-transparent rounded-xl py-2.5 px-4 text-xs font-bold text-white/60">
                  ${item.total.toLocaleString()}
                </div>
              </div>

              <div className="col-span-1 flex justify-end">
                <button 
                  onClick={() => removeLineItem(item.id)}
                  className="p-2.5 rounded-xl hover:bg-red-500/10 text-white/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button 
            onClick={addLineItem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Plus size={14} />
            Yeni Satır Ekle
          </button>

          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 transition-all text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-white/5">
            <Save size={14} />
            Faturayı Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
