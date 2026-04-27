import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CreditCard, Receipt } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function POSModal({ table, onClose, onUpdate }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Sample Menu for Simulation
  const menu = [
    { name: 'Tandoori Chicken', price: 18.99 },
    { name: 'Paneer Tikka', price: 14.50 },
    { name: 'Butter Chicken', price: 19.99 },
    { name: 'Garlic Naan', price: 3.50 },
    { name: 'Mango Lassi', price: 4.99 },
    { name: 'Basmati Rice', price: 5.50 },
  ];

  useEffect(() => {
    fetchOrder();
  }, [table._id]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/pos/table/${table._id}`);
      if (res.data) {
        setOrder(res.data);
        setItems(res.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch order');
    }
  };

  const addItem = (menuItem) => {
    const existing = items.find(i => i.name === menuItem.name);
    if (existing) {
      setItems(items.map(i => i.name === menuItem.name ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { ...menuItem, quantity: 1 }]);
    }
  };

  const removeItem = (name) => {
    setItems(items.filter(i => i.name !== name));
  };

  const calculateTotal = () => items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await API.post(`/pos/table/${table._id}`, {
        items,
        totalAmount: calculateTotal()
      });
      toast.success('Order synchronized');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePay = async () => {
    if (!order) return;
    setIsSaving(true);
    try {
      await API.put(`/pos/${order._id}/pay`);
      toast.success('Payment processed. Table is now available.');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden border border-white/20">
        
        {/* Left: Menu Selection */}
        <div className="flex-1 p-8 bg-slate-50 overflow-y-auto border-r border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase">Spice Hub Menu</h3>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">SIMULATION</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {menu.map((item) => (
              <button
                key={item.name}
                onClick={() => addItem(item)}
                className="card p-4 text-left hover:border-blue-500 hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                  <Plus className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                </div>
                <p className="text-sm font-bold text-slate-400 mt-1">${item.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Current Order */}
        <div className="w-80 sm:w-96 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Table {table.tableNumber}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Current Bill</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="h-6 w-6 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-sm text-center">
                <Receipt className="h-12 w-12 mb-4 opacity-20" />
                No items added yet
              </div>
            ) : (
              items.map((item) => (
                <div key={item.name} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">
                      {item.quantity}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-400">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.name)} className="p-1.5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-8 border-t-2 border-slate-100 border-dashed">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-3xl font-black text-slate-900">${calculateTotal().toFixed(2)}</span>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleSave}
                disabled={isSaving || items.length === 0}
                className="w-full btn-secondary h-12 font-bold"
              >
                {isSaving ? 'Processing...' : 'Synchronize Order'}
              </button>
              
              {order && (
                <button 
                  onClick={handlePay}
                  disabled={isSaving}
                  className="w-full btn-primary h-14 font-black text-lg shadow-xl shadow-blue-600/20 bg-emerald-600 hover:bg-emerald-700 border-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Process Payment
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
