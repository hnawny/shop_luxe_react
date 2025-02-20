import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Building2, Wallet } from 'lucide-react';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
        }

        const data = await response.json();
        
        // ตรวจสอบสถานะการชำระเงิน
        if (data.PaymentStatus === 'paid') {
          navigate('/payment/success', { 
            state: { message: 'คำสั่งซื้อนี้ได้ชำระเงินแล้ว' } 
          });
          return;
        }

        setOrderData(data);
      } catch (err) {
        setError('ไม่พบข้อมูลคำสั่งซื้อ');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token, navigate]);

  const paymentMethods = [
    {
      id: 'Credit Card',
      name: 'บัตรเครดิต/เดบิต',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'ชำระด้วยบัตรเครดิตหรือเดบิตของคุณ'
    },
    {
      id: 'Bank Transfer',
      name: 'โอนเงินผ่านธนาคาร',
      icon: <Building2 className="w-6 h-6" />,
      description: 'โอนเงินผ่านบัญชีธนาคารของคุณ'
    },
    {
      id: 'PayPal',
      name: 'PayPal',
      icon: <Wallet className="w-6 h-6" />,
      description: 'ชำระเงินผ่าน PayPal'
    }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('กรุณาเลือกวิธีการชำระเงิน');
      return;
    }

    setIsProcessing(true);
    try {
      const paymentData = {
        PaymentMethod: selectedMethod
      };

      const response = await fetch(`http://localhost:5001/api/payments/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'การชำระเงินล้มเหลว');
      }

      const result = await response.json();
      navigate('/payment/success', { 
        state: { 
          paymentId: result.payment_id,
          orderData: orderData,
          TrackingID : orderData.order_tracking.TrackingID
        } 
      });
    } catch (err) {
      setError(err.message || 'ไม่สามารถดำเนินการชำระเงินได้');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-6 h-6 border-t-2 border-white border-opacity-20 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-300 text-lg">{error}</p>
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              กลับไปหน้ารายการคำสั่งซื้อ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-8">ชำระเงิน</h1>

        {/* Order Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium mb-4">ข้อมูลคำสั่งซื้อ</h2>
          <div className="space-y-2">
            <p className="text-gray-400">หมายเลขคำสั่งซื้อ: <span className="text-white">{orderData?.order.OrderID}</span></p>
            <p className="text-gray-400">วันที่สั่งซื้อ: <span className="text-white">
              {new Date(orderData?.order.CreatedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span></p>
            <p className="text-gray-400 pt-4">ยอดชำระ: <span className="text-white text-2xl font-semibold">฿{orderData?.order.TotalPrice?.toLocaleString()}</span></p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-medium mb-4">เลือกวิธีการชำระเงิน</h2>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-6 rounded-lg border transition-colors duration-300 ${
                selectedMethod === method.id
                  ? 'border-white bg-zinc-800'
                  : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-4">
                {method.icon}
                <div className="text-left">
                  <h3 className="text-lg font-medium mb-1">{method.name}</h3>
                  <p className="text-gray-400">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedMethod}
            className={`w-full px-6 py-4 rounded-lg font-medium flex items-center justify-center gap-2
              ${isProcessing || !selectedMethod 
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-white text-black hover:bg-gray-100 transition-colors duration-300'
              }`}
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-t-2 border-black border-opacity-20 rounded-full animate-spin"></div>
            ) : (
              'ดำเนินการชำระเงิน'
            )}
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            disabled={isProcessing}
            className="w-full px-6 py-4 border border-zinc-800 rounded-lg font-medium hover:bg-zinc-800 transition-colors duration-300"
          >
            กลับไปหน้ารายการคำสั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;