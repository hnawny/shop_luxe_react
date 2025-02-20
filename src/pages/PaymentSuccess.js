import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowLeft, Clock } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { TrackingID, orderData } = location.state || {};


  if (!orderData) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-300 text-lg">ไม่พบข้อมูลคำสั่งซื้อ</p>
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
        {/* Success Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-semibold mb-4">
              ขอบคุณสำหรับการสั่งซื้อ
            </h1>
            
            <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-lg">
                การชำระเงินของคุณสำเร็จแล้ว
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-400">
              <Package className="w-5 h-5" />
              <span>หมายเลขคำสั่งซื้อ: </span>
              <span className="text-white">{orderData?.order?.OrderID || '-'}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <Package className="w-5 h-5" />
              <span>หมายเลขพัสดุ: </span>
              <span className="text-white">{orderData?.order_tracking?.TrackingID || '-'}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400">
              <Clock className="w-5 h-5" />
              <span>วันที่สั่งซื้อ: </span>
              <span className="text-white">
                {orderData?.order?.CreatedAt 
                  ? new Date(orderData.order.CreatedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '-'
                }
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-zinc-800 pt-6">
            <div className="text-gray-400 space-y-2">
              <p>ใบเสร็จและรายละเอียดการจัดส่งจะถูกส่งไปยังอีเมลของคุณ</p>
              <p>หากมีข้อสงสัยกรุณาติดต่อเรา</p>
              <p className="text-white">เบอร์โทร: 02-XXX-XXXX</p>
              <p className="text-white">อีเมล: support@example.com</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(`/order/${orderData?.order?.OrderID}`)}
            className="w-full px-6 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            ดูรายละเอียดคำสั่งซื้อ
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-4 border border-zinc-800 rounded-lg font-medium hover:bg-zinc-800 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;