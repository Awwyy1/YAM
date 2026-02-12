import React, { useState, useEffect } from 'react';
import {
  loginAdmin,
  logoutAdmin,
  onAuthChange,
  getMenuItems,
  saveMenuItem,
  deleteMenuItem,
  initializeMenuData,
  MenuItem
} from './firebase';
import { User } from 'firebase/auth';
import { LogOut, Plus, Trash2, Save, Coffee, Leaf, Cookie, Loader2, AlertCircle, Check } from 'lucide-react';

// Admin Panel Component
const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'coffee' | 'tea' | 'extra'>('coffee');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadMenu(activeTab);
    }
  }, [user, activeTab]);

  const loadMenu = async (category: string) => {
    try {
      const items = await getMenuItems(category);
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu:', error);
      setMenuItems([]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await loginAdmin(email, password);
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
  };

  const handleSaveItem = async (item: MenuItem) => {
    setSaving(item.id);
    try {
      await saveMenuItem(activeTab, item);
      showMessage('success', 'Saved!');
      await loadMenu(activeTab);
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setSaving(null);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteMenuItem(activeTab, itemId);
      showMessage('success', 'Deleted!');
      await loadMenu(activeTab);
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const handleAddItem = () => {
    const newItem: MenuItem = {
      id: `${activeTab}_${Date.now()}`,
      name_en: 'New Item',
      name_ge: 'ახალი',
      price: '₾0.00',
      desc_en: 'Description',
      desc_ge: 'აღწერა',
      order: menuItems.length
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateItem = (id: string, field: keyof MenuItem, value: string | number) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Initialize data from hardcoded menu (one-time use)
  const handleInitializeData = async () => {
    if (!confirm('This will populate Firestore with the current menu data. Continue?')) return;
    setIsInitializing(true);
    try {
      // Import the hardcoded data
      const coffeeEn = [
        { name: 'Espresso', price: '₾4.00', desc: 'Bold & intense signature blend' },
        { name: 'Espresso Macchiato', price: '₾4.50', desc: 'Espresso with a dollop of foam' },
        { name: 'Americano', price: '₾4.50', desc: 'Espresso with hot water' },
        { name: 'Americano + Milk', price: '₾5.00', desc: 'Americano with steamed milk' },
        { name: 'Cappuccino', price: '₾5.00', desc: 'Balanced espresso, milk and foam' },
        { name: 'Raf Coffee', price: '₾6.00', desc: 'Espresso, cream and vanilla sugar' },
        { name: 'Latte Macchiato', price: '₾5.50', desc: 'Layered milk and espresso' },
        { name: 'Matcha Latte', price: '₾6.00', desc: 'Ceremonial grade matcha with steamed milk' },
        { name: 'Cocoa', price: '₾5.00', desc: 'Rich hot chocolate' },
        { name: 'Double Espresso', price: '₾5.50', desc: 'Two shots of signature blend' },
        { name: 'Double Espresso Macchiato', price: '₾6.00', desc: 'Double shot with foam' },
        { name: 'Double Americano', price: '₾6.00', desc: 'Double shot with hot water' },
        { name: 'Double Americano + Milk', price: '₾6.50', desc: 'Double americano with steamed milk' },
        { name: 'Double Cappuccino', price: '₾6.50', desc: 'Double shot cappuccino' },
      ];
      const coffeeGe = [
        { name: 'ესპრესო', price: '₾4.00', desc: 'მკვეთრი და ინტენსიური ნაზავი' },
        { name: 'ესპრესო მაკიატო', price: '₾4.50', desc: 'ესპრესო ქაფის წვეთით' },
        { name: 'ამერიკანო', price: '₾4.50', desc: 'ესპრესო ცხელ წყალზე' },
        { name: 'ამერიკანო + რძე', price: '₾5.00', desc: 'ამერიკანო ცხელი რძით' },
        { name: 'კაპუჩინო', price: '₾5.00', desc: 'ესპრესოსა და რძის ბალანსი' },
        { name: 'რაფ ყავა', price: '₾6.00', desc: 'ესპრესო, ნაღები და ვანილის შაქარი' },
        { name: 'ლატე მაკიატო', price: '₾5.50', desc: 'რძის და ესპრესოს ფენები' },
        { name: 'მატჩა ლატე', price: '₾6.00', desc: 'მატჩა ცხელი რძით' },
        { name: 'კაკაო', price: '₾5.00', desc: 'მდიდარი ცხელი შოკოლადი' },
        { name: 'ორმაგი ესპრესო', price: '₾5.50', desc: 'ორი შოთი საფირმო ნაზავით' },
        { name: 'ორმაგი ესპრესო მაკიატო', price: '₾6.00', desc: 'ორმაგი შოთი ქაფით' },
        { name: 'ორმაგი ამერიკანო', price: '₾6.00', desc: 'ორმაგი შოთი წყალზე' },
        { name: 'ორმაგი ამერიკანო + რძე', price: '₾6.50', desc: 'ორმაგი ამერიკანო რძით' },
        { name: 'ორმაგი კაპუჩინო', price: '₾6.50', desc: 'ორმაგი კაპუჩინო' },
      ];
      const teaEn = [
        { name: 'Green Tea', price: '₾3.50', desc: 'Classic Japanese sencha, light and grassy' },
        { name: 'Earl Grey', price: '₾3.50', desc: 'Black tea with Italian bergamot oil' },
        { name: 'Matcha', price: '₾5.00', desc: 'Ceremonial grade Japanese green tea powder' },
        { name: 'Jasmine Oolong', price: '₾4.00', desc: 'Semi-oxidized leaves with jasmine blossoms' },
        { name: 'Fresh Mint', price: '₾3.75', desc: 'Hand-picked garden mint, served hot' },
      ];
      const teaGe = [
        { name: 'მწვანე ჩაი', price: '₾3.50', desc: 'კლასიკური იაპონური სენჩა' },
        { name: 'ერლ გრეი', price: '₾3.50', desc: 'შავი ჩაი ბერგამოტის ზეთით' },
        { name: 'მატჩა', price: '₾5.00', desc: 'იაპონური მწვანე ჩაის ფხვნილი' },
        { name: 'ჟასმინის ოლონგი', price: '₾4.00', desc: 'ნახევრად ფერმენტირებული ჟასმინით' },
        { name: 'ახალი პიტნა', price: '₾3.75', desc: 'ბაღის პიტნა, ცხლად მიწოდებული' },
      ];
      const extraEn = [
        { name: 'Croissant', price: '₾4.50', desc: 'French butter croissant, baked fresh daily' },
        { name: 'Almond Croissant', price: '₾5.50', desc: 'Filled with almond cream and toasted flakes' },
        { name: 'Banana Bread', price: '₾4.00', desc: 'Homemade with walnuts and dark chocolate' },
        { name: 'Cheesecake', price: '₾6.50', desc: 'New York style, creamy and dense' },
        { name: 'Cookie', price: '₾3.00', desc: 'Chunky chocolate chip, soft center' },
        { name: 'Granola Bowl', price: '₾7.00', desc: 'Greek yogurt, honey, seasonal fruits' },
        { name: 'Avocado Toast', price: '₾8.50', desc: 'Sourdough, smashed avo, chili flakes, egg' },
      ];
      const extraGe = [
        { name: 'კრუასანი', price: '₾4.50', desc: 'ფრანგული კარაქის კრუასანი, ყოველდღე ახალი' },
        { name: 'ნუშის კრუასანი', price: '₾5.50', desc: 'ნუშის კრემით და შემწვარი ფანტელებით' },
        { name: 'ბანანის პური', price: '₾4.00', desc: 'ნიგვზით და შავი შოკოლადით' },
        { name: 'ჩიზქეიქი', price: '₾6.50', desc: 'ნიუ-იორკის სტილი, კრემისებრი' },
        { name: 'ორცხობილა', price: '₾3.00', desc: 'შოკოლადის ნატეხებით, რბილი შუაგული' },
        { name: 'გრანოლას თასი', price: '₾7.00', desc: 'ბერძნული იოგურტი, თაფლი, სეზონური ხილი' },
        { name: 'ავოკადო ტოსტი', price: '₾8.50', desc: 'მჟავე პური, ავოკადო, წიწაკა, კვერცხი' },
      ];

      await initializeMenuData(coffeeEn, coffeeGe, teaEn, teaGe, extraEn, extraGe);
      showMessage('success', 'Menu data initialized!');
      await loadMenu(activeTab);
    } catch (error: any) {
      showMessage('error', error.message);
    }
    setIsInitializing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF3B30] animate-spin" />
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">YAM</h1>
            <p className="text-gray-500 mt-1">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#161616] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B30]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#161616] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B30]"
            />
            {loginError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-[#FF3B30] text-white font-bold rounded-lg hover:bg-[#FF3B30]/90 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight">YAM Admin</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg ${
          message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Content */}
      <main className="max-w-4xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('coffee')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'coffee' ? 'bg-[#FF3B30] text-white' : 'bg-[#161616] text-gray-400 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            Coffee
          </button>
          <button
            onClick={() => setActiveTab('tea')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tea' ? 'bg-[#FF3B30] text-white' : 'bg-[#161616] text-gray-400 hover:text-white'
            }`}
          >
            <Leaf className="w-4 h-4" />
            Tea
          </button>
          <button
            onClick={() => setActiveTab('extra')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'extra' ? 'bg-[#FF3B30] text-white' : 'bg-[#161616] text-gray-400 hover:text-white'
            }`}
          >
            <Cookie className="w-4 h-4" />
            Extra
          </button>
        </div>

        {/* Initialize Data Button (show only if no items) */}
        {menuItems.length === 0 && (
          <div className="mb-6 p-4 bg-[#161616] rounded-lg border border-gray-800">
            <p className="text-gray-400 mb-3">No menu items found. Initialize with default data?</p>
            <button
              onClick={handleInitializeData}
              disabled={isInitializing}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF3B30]/90 disabled:opacity-50"
            >
              {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isInitializing ? 'Initializing...' : 'Initialize Menu Data'}
            </button>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.id} className="p-4 bg-[#161616] rounded-lg border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* English */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Name (EN)</label>
                  <input
                    type="text"
                    value={item.name_en}
                    onChange={(e) => updateItem(item.id, 'name_en', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                  />
                  <label className="text-xs text-gray-500 uppercase">Description (EN)</label>
                  <input
                    type="text"
                    value={item.desc_en}
                    onChange={(e) => updateItem(item.id, 'desc_en', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
                {/* Georgian */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase">Name (GE)</label>
                  <input
                    type="text"
                    value={item.name_ge}
                    onChange={(e) => updateItem(item.id, 'name_ge', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                  />
                  <label className="text-xs text-gray-500 uppercase">Description (GE)</label>
                  <input
                    type="text"
                    value={item.desc_ge}
                    onChange={(e) => updateItem(item.id, 'desc_ge', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase">Price</label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-800 rounded text-white focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
                <div className="flex gap-2 pt-5">
                  <button
                    onClick={() => handleSaveItem(item)}
                    disabled={saving === item.id}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddItem}
          className="mt-4 w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-[#FF3B30] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </main>
    </div>
  );
};

export default AdminPanel;
