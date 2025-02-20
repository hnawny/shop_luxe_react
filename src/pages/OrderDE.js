import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, AlertCircle, CreditCard } from "lucide-react";

const OrderDE = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert("Error fetching order");
        setLoading(false);
      });
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">กำลังโหลด...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">ไม่พบรายการคำสั่งซื้อ</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-5xl mx-auto p-5">
        <div className="bg-zinc-900 border border-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">
              รายละเอียดคำสั่งซื้อ #{order.order.OrderID}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">วันที่สั่งซื้อ</p>
                <p>{new Date(order.order.OrderDate).toLocaleDateString('th-TH')}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">สถานะ</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusColor(order.order.Status)}`}>
                  {getStatusIcon(order.order.Status)}
                  <span className="ml-2">{order.order.Status}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h4 className="text-lg mb-4">สถานะการจัดส่ง</h4>
              <TrackingStatus status={order.order_tracking.Status} />
              {order.order_tracking && (
                <div className="mt-4 p-4 bg-black bg-opacity-50 rounded-lg">
                  <p className="text-sm text-gray-400">ข้อมูลการจัดส่ง</p>
                  <p className="mt-2">เลขพัสดุ: {order.order_tracking.TrackingID}</p>
                  <p className="mt-1">อัพเดทล่าสุด: {new Date(order.order_tracking.UpdatedAt).toLocaleString('th-TH')}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h4 className="text-lg mb-4">รายการสินค้า</h4>
              <div className="space-y-4">
                {order.order_details.map((detail) => (
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
              <p className="text-xl font-medium">{formatPrice(order.order.TotalPrice)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDE;