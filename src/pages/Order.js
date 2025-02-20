import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // รับข้อมูลที่ส่งมาจากหน้า Cart
  const { cartItems, totalAmount, customerInfo } = location.state || {};

  // ถ้าไม่มีข้อมูล cart ให้ redirect กลับไปหน้า cart
  if (!cartItems) {
    navigate('/cart');
    return null;
  }

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      // Create order first
      const orderData = {
        CustomerID: customerInfo.CustomerID,
        TotalPrice: totalAmount,
        CartItems: cartItems.map(item => ({
          ProductID: item.ProductID,
          Quantity: item.Quantity,
          Subtotal: item.Price * item.Quantity
        }))
      };
  
      const orderResponse = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });
  
      if (!orderResponse.ok) throw new Error('Failed to create order');
      const orderResult = await orderResponse.json();
  
      // Process payment
      const paymentResponse = await fetch('http://localhost:5001/api/payments', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          OrderID: orderResult.order_id,
          Amount: totalAmount
        })
      });
  
      if (!paymentResponse.ok) throw new Error('Failed to process payment');
      const paymentResult = await paymentResponse.json();
  
      // Navigate to success page
      navigate(`/payment/${orderResult.order_id}`);
    } catch (err) {
      setError('ไม่สามารถดำเนินการสั่งซื้อได้');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl mb-12">ยืนยันการสั่งซื้อ</h1>

        {/* Customer Information */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl mb-4">ข้อมูลการจัดส่ง</h2>
          <div className="space-y-2 text-gray-300">
            <p>ชื่อ: {customerInfo?.FullName}</p>
            <p>ที่อยู่: {customerInfo?.Address}</p>
            <p>เบอร์โทรศัพท์: {customerInfo?.Phone}</p>
            <p>อีเมล: {customerInfo?.Email}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl mb-4">รายการสินค้า</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.ProductID} className="flex justify-between items-center py-4 border-b border-zinc-800 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden">
                    <img src={item.ImageURL} alt={item.ProductName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">{item.ProductName}</h3>
                    <p className="text-gray-400">จำนวน: {item.Quantity} ชิ้น</p>
                  </div>
                </div>
                <p className="text-lg">฿{(item.Price * item.Quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl mb-4">สรุปคำสั่งซื้อ</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-400">
              <span>ยอดรวมสินค้า</span>
              <span>฿{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>ค่าจัดส่ง</span>
              <span>ฟรี</span>
            </div>
            <div className="flex justify-between text-xl pt-4 border-t border-zinc-800">
              <span>ยอดรวมทั้งหมด</span>
              <span>฿{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-800 p-4 rounded-lg mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            className="w-full px-6 py-4 bg-white text-black hover:bg-gray-100 disabled:bg-gray-300 transition duration-300 rounded-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-t-2 border-black border-opacity-20 rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                ยืนยันการสั่งซื้อ
              </>
            )}
          </button>
          
          <button
            onClick={() => navigate('/cart')}
            disabled={isProcessing}
            className="w-full px-6 py-4 border border-zinc-800 hover:bg-zinc-800 disabled:border-zinc-700 disabled:hover:bg-transparent transition duration-300 rounded-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับไปที่ตะกร้าสินค้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;