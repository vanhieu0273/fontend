import React, { useState, useEffect } from 'react';
import axios from '../config/axios';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [period, setPeriod] = useState('daily'); // 'daily' hoặc 'monthly'

  const fetchStatistics = async (startDate = '', endDate = '') => {
    try {
      setLoading(true);
      let url = `/statistics/sales?period=${period}`;
      
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await axios.get(url);
      setStatistics(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu thống kê');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [period]); // Re-fetch khi period thay đổi

  const handleDateRangeChange = () => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchStatistics(dateRange.startDate, dateRange.endDate);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    // Reset date range khi chuyển period
    setDateRange({ startDate: '', endDate: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => fetchStatistics()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống Kê Bán Hàng</h1>
          <p className="text-gray-600">Theo dõi hiệu suất bán hàng và doanh thu</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc thời gian</h2>
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại thống kê</label>
              <select
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="daily">Theo ngày</option>
                <option value="monthly">Theo tháng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleDateRangeChange}
              disabled={!dateRange.startDate || !dateRange.endDate}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Áp dụng
            </button>
            <button
              onClick={() => {
                setDateRange({ startDate: '', endDate: '' });
                fetchStatistics();
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Mặc định ({statistics?.period === 'daily' ? '7 ngày' : '12 tháng'})
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Tổng Doanh Thu</p>
                <p className="text-3xl font-bold">{formatCurrency(statistics.totalRevenue)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Tổng Đơn Hàng</p>
                <p className="text-3xl font-bold">{statistics.totalOrders}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Sản Phẩm Đã Bán</p>
                <p className="text-3xl font-bold">{statistics.totalProductsSold}</p>
              </div>
              <div className="text-4xl">🛍️</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Trung Bình/Đơn</p>
                <p className="text-3xl font-bold">
                  {statistics.totalOrders > 0 
                    ? formatCurrency(Math.round(statistics.totalRevenue / statistics.totalOrders))
                    : formatCurrency(0)
                  }
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Simple Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Biểu Đồ Doanh Thu {statistics?.period === 'daily' ? 'Theo Ngày' : 'Theo Tháng'}
          </h2>
          
          <div className="space-y-4">
            {(statistics?.revenueData || []).map((day, index) => {
              const maxRevenue = Math.max(...(statistics?.revenueData?.map(d => d.revenue) || [0]));
              const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-24 text-sm text-gray-600 font-medium">
                    {formatDate(day.period)}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-8 relative">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full transition-all duration-300 flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {day.revenue > 0 && (
                          <span className="text-white text-sm font-medium">
                            {formatCurrency(day.revenue)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(day.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Chart Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(statistics?.totalRevenue || 0)}
                </div>
                <div className="text-sm text-gray-600">Tổng doanh thu</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.round((statistics?.totalRevenue || 0) / (statistics?.revenueData?.length || 1)))}
                </div>
                <div className="text-sm text-gray-600">
                  Trung bình/{statistics?.period === 'daily' ? 'ngày' : 'tháng'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {(statistics?.revenueData || []).filter(day => day.revenue > 0).length}/{statistics?.revenueData?.length || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {statistics?.period === 'daily' ? 'Ngày' : 'Tháng'} có doanh thu
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Sản Phẩm Bán Chạy</h2>
          <div className="space-y-4">
            {(statistics?.topSellingProducts || []).map((item, index) => (
              <div key={item.product._id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-16 h-16 mr-4">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</p>
                  <p className="text-xs text-gray-500">Đơn giá: {formatCurrency(item.product.price)}</p>
                </div>
                <div className="ml-4 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Thống Kê Phương Thức Thanh Toán</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(statistics?.paymentMethodStats || {}).map(([method, stats]) => (
              <div key={method} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {method === 'bank_transfer' ? 'Chuyển khoản' : 
                     method === 'cod' ? 'Thanh toán khi nhận hàng' : method}
                  </h3>
                  <div className="text-2xl">
                    {method === 'bank_transfer' ? '🏦' : 
                     method === 'cod' ? '💵' : '💳'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số đơn hàng:</span>
                    <span className="text-sm font-medium text-gray-900">{stats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Doanh thu:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((stats.revenue / (statistics?.totalRevenue || 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
