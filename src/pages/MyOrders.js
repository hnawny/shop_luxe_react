import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import { Package, Truck, CheckCircle, Clock, AlertCircle, CreditCard } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert("Unauthorized");
        setLoading(false);
      });
  }, []);

  const fetchTrackingInfo = async (trackingId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/order-tracking/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrackingInfo(response.data);
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'paid':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-500';
      case 'delivered':
        return 'bg-green-500/10 text-green-500';
      case 'paid':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  const TrackingStatus = ({ status }) => {
    // Define steps and their properties
    const steps = [
      { key: 'paid', label: 'ชำระเงินแล้ว', icon: CreditCard, color: 'from-pink-500 to-rose-500' },
      { key: 'pending', label: 'รอดำเนินการ', icon: Clock, color: 'from-purple-500 to-violet-500' },
      { key: 'processing', label: 'กำลังจัดเตรียม', icon: Package, color: 'from-blue-500 to-indigo-500' },
      { key: 'shipped', label: 'จัดส่งแล้ว', icon: Truck, color: 'from-teal-500 to-emerald-500' },
      { key: 'delivered', label: 'ได้รับสินค้าแล้ว', icon: CheckCircle, color: 'from-green-500 to-emerald-500' }
    ];
  
    const currentStepIndex = steps.findIndex(
      step => step.key === status?.toLowerCase()
    );
  
    // Get gradient color based on status
    const getStatusColor = (index) => {
      if (index <= currentStepIndex) {
        return `bg-gradient-to-r ${steps[index].color} shadow-lg`;
      }
      return 'bg-gray-100 dark:bg-gray-700';
    };
  
    const calculateWidth = () => {
      if (currentStepIndex === -1) return '0%';
      return `${((currentStepIndex) / (steps.length - 1)) * 100}%`;
    };
  
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex flex-col items-center relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${getStatusColor(index)}`}>
                  <Icon className={`w-7 h-7 ${index <= currentStepIndex ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                  index <= currentStepIndex 
                    ? `bg-clip-text text-transparent bg-gradient-to-r ${steps[index].color}` 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: calculateWidth() }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] mb-16">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://www.pandora.co.th/media/wysiwyg/PAN-01-JAN-WEB-GWP-DESKTOP-1400X500PX.jpg')] bg-cover bg-center" />
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-4xl md:text-6xl text-white mb-4">
              รายการคำสั่งซื้อ
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              ประวัติการสั่งซื้อทั้งหมดของคุณ
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-5xl mx-auto p-5">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">กำลังโหลด...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-zinc-900 border border-gray-800 rounded-lg">
            <div className="text-center py-12">
              <p className="text-gray-400">ไม่พบรายการคำสั่งซื้อ</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.OrderID} 
                className="bg-zinc-900 border border-gray-800 hover:border-gray-700 rounded-lg transition duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-lg font-medium mb-2">รหัสคำสั่งซื้อ: {order.OrderID}</p>
                      <p className="text-gray-400">
                        ยอดรวม: {formatPrice(order.TotalPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusColor(order.Status)}`}>
                        {getStatusIcon(order.Status)}
                        <span className="ml-2">{order.Status}</span>
                      </div>
                      <p className="text-gray-400 mt-2">
                        จำนวนรายการ: {order.order_details.length}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tracking Status */}
                  <div className="mt-6 border-t border-gray-800 pt-6">
                    <TrackingStatus status={order?.order_tracking?.Status} />
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <p className="text-gray-400">
                      วันที่สั่งซื้อ: {new Date(order.OrderDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <button 
                      className="px-6 py-2 bg-white text-black rounded hover:bg-gray-100 transition duration-300"
                      onClick={() => {
                        setSelectedOrder(order);
                        if (order.TrackingID) {
                          fetchTrackingInfo(order.TrackingID);
                        }
                      }}
                    >
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Transition appear show={selectedOrder !== null} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50 text-gray-50"
          onClose={() => {
            setSelectedOrder(null);
            setTrackingInfo(null);
          }}
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
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-t-xl bg-zinc-900 p-6 transition-all">
                  {selectedOrder && (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-2xl font-medium">
                          รายละเอียดคำสั่งซื้อ #{selectedOrder.OrderID}
                        </Dialog.Title>
                        <button 
                          onClick={() => {
                            setSelectedOrder(null);
                            setTrackingInfo(null);
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          ปิด
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 mb-1">วันที่สั่งซื้อ</p>
                            <p>{new Date(selectedOrder.OrderDate).toLocaleDateString('th-TH')}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">สถานะ</p>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusColor(selectedOrder.Status)}`}>
                              {getStatusIcon(selectedOrder.Status)}
                              <span className="ml-2">{selectedOrder.Status}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tracking Status in Modal */}
                        <div className="border-t border-gray-800 pt-6">
                          <h4 className="text-lg mb-4">สถานะการจัดส่ง</h4>
                          <TrackingStatus status={selectedOrder?.order_tracking?.Status} />
                          {trackingInfo && (
                            <div className="mt-4 p-4 bg-black bg-opacity-50 rounded-lg">
                              <p className="text-sm text-gray-400">ข้อมูลการจัดส่ง</p>
                              <p className="mt-2">เลขพัสดุ: {trackingInfo.TrackingID}</p>
                              <p className="mt-1">อัพเดทล่าสุด: {new Date(trackingInfo.LastUpdate).toLocaleString('th-TH')}</p>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-800 pt-6">
                          <h4 className="text-lg mb-4">รายการสินค้า</h4>
                          <div className="space-y-4">
                            {selectedOrder.order_details.map((detail) => (
                              <div key={detail.OrderDetailID} className="flex items-center justify-between p-4 bg-black bg-opacity-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <img 
                                    src={detail.product.ImageURL} 
                                    alt={detail.product.ProductName}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium">{detail.product.ProductName}</p>
                                    <p className="text-sm text-gray-400">{detail.product.Description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="mb-1">x{detail.Quantity}</p>
                                  <p className="text-gray-400">{formatPrice(detail.Subtotal)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
                          <p className="text-xl">ยอดรวมทั้งสิ้น</p>
                          <p className="text-xl font-medium">{formatPrice(selectedOrder.TotalPrice)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Orders;