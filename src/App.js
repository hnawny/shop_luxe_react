import React, { useContext, useState, Fragment, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ShoppingCart, User, X, Menu } from "lucide-react";
import { Dialog, Transition } from '@headlessui/react';
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Order from "./pages/Order";
import Cart from "./pages/Cart";
import OrderDE from "./pages/OrderDE";
import Payment from "./pages/Payment";
import TrackingSearch from "./pages/TrackingSearch";
import AdvertisingPopup from "./pages/AdvertisingPopup"

import PaymentSuccess from "./pages/PaymentSuccess";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const AddressRegistrationDialog = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
      });
    
      // เพิ่ม useEffect เพื่ออัพเดทข้อมูลเมื่อ initialData เปลี่ยน
      useEffect(() => {
        if (initialData) {
          setFormData({
            fullName: initialData.FullName || "",
            email: initialData.Email || "",
            phone: initialData.Phone || "",
            address: initialData.Address || ""
          });
        }
      }, [initialData]);

//   console.log("DATA :", initialData )

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

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const token = localStorage.getItem("token");
    const [customerInfo, setCustomerInfo] = useState(null);
    // console.log(customerInfo)

    useEffect(() => {
        if (token) {
          fetchCustomerInfo();
        }
      }, [token]);
    

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
          console.log("Fetched customer info:", data); // เพิ่ม log เพื่อตรวจสอบข้อมูล
          setCustomerInfo(data);
        } catch (err) {
          console.error('Error fetching customer info:', err);
          alert('ไม่สามารถดึงข้อมูลลูกค้าได้');
        }
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
          setIsProfileOpen(false);
          setIsAddressDialogOpen(false);
        } catch (err) {
          alert('ไม่สามารถบันทึกข้อมูลได้');
        }
      };
    

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="App">
            <nav className="bg-black/90 backdrop-blur-sm fixed w-full z-50 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-serif text-white">
                                LUXE
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center">
                            <div className="flex items-center space-x-8">
                                <Link to="/" className="text-white hover:text-gray-300 transition-colors px-3 py-2">
                                    หน้าแรก
                                </Link>
                                <Link to="/products" className="text-white hover:text-gray-300 transition-colors px-3 py-2">
                                    สินค้า
                                </Link>
                                {user ? (
                                    <>
                                        
                                        <Link to="/my-orders" className="text-white hover:text-gray-300 transition-colors px-3 py-2">
                                            คำสั่งซื้อ
                                        </Link>
                                        <Link to="/cart" className="text-white hover:text-gray-300 transition-colors p-2">
                                            <ShoppingCart className="h-6 w-6" />
                                        </Link>
                                        <button 
                                            onClick={() => setIsProfileOpen(true)}
                                            className="text-white hover:text-gray-300 transition-colors p-2"
                                        >
                                            <User className="h-6 w-6" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="text-white hover:text-gray-300 transition-colors px-3 py-2">
                                            เข้าสู่ระบบ
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors ml-4"
                                        >
                                            สมัครสมาชิก
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <Transition
                    show={isMobileMenuOpen}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="md:hidden border-t border-gray-700">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link 
                                to="/" 
                                className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                หน้าแรก
                            </Link>
                            <Link 
                                to="/products" 
                                className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                สินค้า
                            </Link>
                            {user ? (
                                <>
                                    <Link 
                                        to="/my-orders" 
                                        className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        คำสั่งซื้อ
                                    </Link>
                                    <Link 
                                        to="/cart" 
                                        className="text-white hover:bg-gray-700 flex items-center px-3 py-2 rounded-md"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        ตะกร้าสินค้า
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsProfileOpen(true);
                                        }}
                                        className="text-white hover:bg-gray-700 w-full text-left flex items-center px-3 py-2 rounded-md"
                                    >
                                        <User className="h-5 w-5 mr-2" />
                                        โปรไฟล์
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md mt-2"
                                    >
                                        ออกจากระบบ
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        เข้าสู่ระบบ
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        สมัครสมาชิก
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </Transition>
            </nav>

            {/* Profile Modal */}
            <Transition appear show={isProfileOpen} as={Fragment}>
                <Dialog 
                    as="div" 
                    className="relative z-50"
                    onClose={() => setIsProfileOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-full"
                                enterTo="opacity-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-full"
                            >
                                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-t-xl bg-zinc-900 text-white transition-all">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <Dialog.Title className="text-2xl font-medium">
                                                โปรไฟล์
                                            </Dialog.Title>
                                            <button 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                ปิด
                                            </button>
                                        </div>

                                        {user && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-gray-400 mb-1">ชื่อผู้ใช้</p>
                                                        <p>{user.FullName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 mb-1">อีเมล</p>
                                                        <p>{user.Email}</p>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-800 pt-6">
                                                    <div className="space-y-4">
                                                        <Link 
                                                            to="/my-orders"
                                                            onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center justify-between p-4 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                                                        >
                                                            <span>ประวัติการสั่งซื้อ</span>
                                                            <span className="text-gray-400">ดูทั้งหมด →</span>
                                                        </Link>
                                                    </div>
                                                    <div className="space-y-4 mt-2">
                                                        <Link 
                                                            to="/tracking"
                                                            onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center justify-between p-4 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                                                        >
                                                            <span>เช็คพัสดุ</span>
                                                            <span className="text-gray-400"> →</span>
                                                        </Link>
                                                    </div>
                                                    <div className="space-y-4 mt-2">
                                                        <Link 
                                                            // to="/tracking"
                                                            onClick={() => { setIsAddressDialogOpen(true); setIsProfileOpen(false);}}
                                                            // onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center justify-between p-4 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                                                        >
                                                            <span>แก้ไขข้อมูล</span>
                                                            <span className="text-gray-400"> →</span>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-800 pt-6">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-white bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-colors"
                                                    >
                                                        ออกจากระบบ
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <AdvertisingPopup />

            <AddressRegistrationDialog
            isOpen={isAddressDialogOpen}
            onClose={() => setIsAddressDialogOpen(false)}
            onSubmit={handleAddressSubmit}
            initialData={customerInfo}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order/:id" element={<OrderDE />} />

                <Route path="/payment/:id" element={<Payment />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/tracking" element={<TrackingSearch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;