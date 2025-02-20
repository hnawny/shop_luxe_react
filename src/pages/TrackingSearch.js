import React, { useState } from 'react';
import { Search, Package, AlertCircle, CreditCard, Clock, Truck, CheckCircle } from 'lucide-react';


const TrackingSearch = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('กรุณากรอกหมายเลขติดตามพัสดุ');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5001/api/order-tracking/${trackingId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'ไม่พบข้อมูลการติดตามพัสดุ');
      }
      
      setTrackingData(data);
    } catch (err) {
      setError(err.message);
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Package className="w-16 h-16 mx-auto text-purple-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ติดตามสถานะพัสดุ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            กรอกหมายเลขติดตามเพื่อตรวจสอบสถานะพัสดุของคุณ
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="กรอกหมายเลขติดตามพัสดุ"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                          focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700
                          dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
                       hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2
                       focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 transition-all
                       duration-200 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Tracking Result */}
        {trackingData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ข้อมูลการติดตาม
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                หมายเลขติดตาม: {trackingData.TrackingID}
              </p>
            </div>
            <TrackingStatus status={trackingData.Status} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingSearch;