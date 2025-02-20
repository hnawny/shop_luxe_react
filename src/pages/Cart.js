import React, { useState, useEffect } from 'react';
import { Trash2, X, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddressRegistrationDialog = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.FullName || "",
    email: initialData?.Email || "",
    phone: initialData?.Phone || "",
    address: initialData?.Address || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div className="w-full max-w-md bg-zinc-900 rounded-t-xl border border-zinc-800 shadow-xl p-6">
        <div className="relative w-full">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-700 rounded-full" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-white">ลงทะเบียนที่อยู่</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring focus:ring-white/30 outline-none"
              placeholder="กรอกชื่อ-นามสกุล"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring focus:ring-white/30 outline-none"
              placeholder="กรอกเบอร์โทรศัพท์"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              อีเมล
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring focus:ring-white/30 outline-none"
              placeholder="กรอกอีเมล"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              ที่อยู่จัดส่ง
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring focus:ring-white/30 outline-none"
              rows={4}
              placeholder="กรอกที่อยู่จัดส่ง"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const token = localStorage.getItem("token");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  useEffect(() => {
    fetchCartItems();
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/profile/info', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error('Failed to fetch customer info');
      
      const data = await response.json();
      setCustomerInfo(data);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลลูกค้าได้');
    }
  };

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5001/api/cart`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) throw new Error("Failed to fetch cart items");
  
      const data = await response.json();
      setCartItems(data.cart_items);
      setError(null);
    } catch (err) {
      setError("❌ ไม่สามารถโหลดข้อมูลตะกร้าสินค้าได้");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId) => {
    try {
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ProductID: productId,
          Quantity: 1
        })
      });
  
      if (!response.ok) throw new Error('Failed to increase quantity');
      fetchCartItems();
    } catch (err) {
      setError('ไม่สามารถเพิ่มจำนวนสินค้าได้');
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      const response = await fetch('http://localhost:5001/api/cart/remove', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ProductID: productId })
      });
  
      if (!response.ok) throw new Error('Failed to decrease quantity');
      fetchCartItems();
    } catch (err) {
      setError('ไม่สามารถลดจำนวนสินค้าได้');
    }
  };

  const handleCheckout = async () => {
    if (!customerInfo?.Phone || !customerInfo?.Address) {
      navigate('/profile/address');
      return;
    }
  
    navigate('/order', { 
      state: { 
        cartItems,
        totalAmount: calculateTotal(),
        customerInfo
      } 
    });
  };

  const handleAddressSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      await fetchCustomerInfo();
      setIsAddressDialogOpen(false);
    } catch (err) {
      setError('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.Price * item.Quantity), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 flex justify-center items-center">
          <div className="w-16 h-16 border-t-2 border-white border-opacity-20 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-zinc-900 border border-zinc-800 p-16 text-center rounded-lg">
            <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl mb-4">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <button 
              onClick={fetchCartItems}
              className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-gray-100 transition duration-300 gap-2"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-zinc-900 border border-zinc-800 p-16 text-center rounded-lg">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl mb-4">ตะกร้าของคุณว่างเปล่า</h2>
            <p className="text-gray-400 mb-8">เริ่มช้อปปิ้งเพื่อเพิ่มสินค้าในตะกร้า</p>
            <button 
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-gray-100 transition duration-300 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับไปเลือกซื้อสินค้า
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl mb-12">ตะกร้าสินค้า</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.ProductID} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.ImageURL} alt={item.ProductName} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg">{item.ProductName}</h3>
                      <button 
                        onClick={() => decreaseQuantity(item.ProductID)}
                        className="text-gray-500 hover:text-white transition duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-1">
                        <button 
                          onClick={() => decreaseQuantity(item.ProductID)}
                          className="p-2 hover:bg-zinc-700 rounded-lg transition duration-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.Quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.ProductID)}
                          className="p-2 hover:bg-zinc-700 rounded-lg transition duration-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xl">฿{(item.Price * item.Quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg sticky top-6">
                        <h2 className="text-xl mb-6">สรุปคำสั่งซื้อ</h2>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-400">จำนวนสินค้า</span>
                                <span>{cartItems.reduce((sum, item) => sum + item.Quantity, 0)} ชิ้น</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">ค่าจัดส่ง</span>
                                <span>ฟรี</span>
                            </div>
                            <div className="flex justify-between text-xl pt-4 border-t border-zinc-800">
                                <span>ยอดรวมทั้งหมด</span>
                                <span>฿{calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        {!customerInfo?.Phone || !customerInfo?.Address ? (
                          <div className="mb-4 p-4 bg-red-900/50 border border-red-800 rounded-lg">
                            <p className="text-sm text-red-300 mb-2">
                              กรุณาลงทะเบียนที่อยู่และเบอร์โทรศัพท์ก่อนดำเนินการสั่งซื้อ
                            </p>
                            <button 
                               onClick={() => setIsAddressDialogOpen(true)}
                              className="w-full px-6 py-3 bg-red-500 text-white hover:bg-red-600 transition duration-300 rounded-lg"
                            >
                              ลงทะเบียนที่อยู่
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={handleCheckout}
                            className="w-full px-6 py-4 bg-white text-black hover:bg-gray-100 transition duration-300 rounded-lg mb-4"
                          >
                            ดำเนินการสั่งซื้อ
                          </button>
                        )}
                        
                        <button 
                          onClick={() => navigate("/products")} 
                          className="w-full px-6 py-4 border border-zinc-800 hover:bg-zinc-800 transition duration-300 rounded-lg flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          เลือกซื้อสินค้าต่อ
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <AddressRegistrationDialog
  isOpen={isAddressDialogOpen}
  onClose={() => setIsAddressDialogOpen(false)}
  onSubmit={handleAddressSubmit}
  initialData={customerInfo}
/>
    </div>
  );
};

export default Cart;
