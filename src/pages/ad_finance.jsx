import React, { useState, useEffect } from 'react';
import axios from '../config/axios';

const FinancePage = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [period, setPeriod] = useState('daily'); // 'daily' hoặc 'monthly'

  const fetchFinancialData = async (startDate = '', endDate = '') => {
    try {
      setLoading(true);
      let url = `/statistics/financial?period=${period}`;
      
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await axios.get(url);
      setFinancialData(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu thống kê tài chính');
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [period]); // Re-fetch khi period thay đổi

  const handleDateRangeChange = () => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchFinancialData(dateRange.startDate, dateRange.endDate);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    // Reset date range khi chuyển period
    setDateRange({ startDate: '', endDate: '' });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getProfitColor = (profit) => {
    if (profit === null || profit === undefined) return 'text-gray-600';
    return profit >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getProfitBgColor = (profit) => {
    if (profit === null || profit === undefined) return 'bg-gray-100';
    return profit >= 0 ? 'bg-green-100' : 'bg-red-100';
  };

  const calculateProfit = (revenue, cost) => {
    if (revenue === null || cost === null) return null;
    return revenue - cost;
  };

  const calculateProfitMargin = (revenue, cost) => {
    if (revenue === null || cost === null || revenue === 0) return 'N/A';
    const profit = revenue - cost;
    return `${((profit / revenue) * 100).toFixed(1)}%`;
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
            onClick={() => fetchFinancialData()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!financialData) {
    return null;
  }

  const { summary, expenses, statsData, topSellingProducts } = financialData;

  // Calculate actual profit and margin
  const actualProfit = calculateProfit(summary.totalRevenue, summary.totalCost);
  const actualProfitMargin = calculateProfitMargin(summary.totalRevenue, summary.totalCost);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống Kê Tài Chính</h1>
          <p className="text-gray-600">Phân tích toàn diện về tình hình tài chính doanh nghiệp</p>
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
                fetchFinancialData();
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Mặc định ({period === 'daily' ? '7 ngày' : '12 tháng'})
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Tổng Doanh Thu</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Tổng Chi Phí</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalCost)}</p>
                <p className="text-sm opacity-90">
                  {summary.totalCost === null ? 'Chưa có dữ liệu' : 'Đã cập nhật'}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Tổng Chi Phí Vận Hành</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</p>
              </div>
              <div className="text-4xl">💸</div>
            </div>
          </div>

          <div className={`rounded-lg shadow-lg p-6 text-white ${actualProfit !== null && actualProfit >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${actualProfit !== null && actualProfit >= 0 ? 'text-green-100' : 'text-gray-100'}`}>Lợi Nhuận</p>
                <p className="text-2xl font-bold">{formatCurrency(actualProfit)}</p>
                <p className="text-sm opacity-90">
                  Biên lợi nhuận: {actualProfitMargin}
                </p>
              </div>
              <div className="text-4xl">
                {actualProfit === null ? '❓' : actualProfit >= 0 ? '📈' : '📉'}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Đơn Hàng & Sản Phẩm</h3>
              <div className="text-2xl font-bold text-purple-600 mb-1">{summary.totalOrders}</div>
              <p className="text-sm text-purple-700">{summary.totalProductsSold} sản phẩm</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Trạng Thái Dữ Liệu</h3>
              <div className="text-lg font-bold text-yellow-600 mb-1">
                {summary.totalCost === null ? '⚠️ Thiếu Chi Phí' : '✅ Đầy Đủ'}
              </div>
              <p className="text-sm text-yellow-700">
                {summary.totalCost === null ? 'Cần cập nhật giá vốn sản phẩm' : 'Dữ liệu đã hoàn chỉnh'}
              </p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Tỷ Lệ Chi Phí/Doanh Thu</h3>
              <div className="text-lg font-bold text-blue-600 mb-1">
                {summary.totalRevenue > 0 ? `${((summary.totalExpenses / summary.totalRevenue) * 100).toFixed(1)}%` : 'N/A'}
              </div>
              <p className="text-sm text-blue-700">
                {summary.totalExpenses > summary.totalRevenue ? 'Chi phí cao hơn doanh thu' : 'Chi phí thấp hơn doanh thu'}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Biểu Đồ Tài Chính {period === 'daily' ? 'Theo Ngày' : 'Theo Tháng'}
          </h2>
          
          {/* Chart Container */}
          <div className="relative">
            <div className="h-80 w-full overflow-x-auto">
              <div className="min-w-full h-full flex flex-col">
                {/* Y-axis labels */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                    {(() => {
                      const maxValue = Math.max(
                        ...statsData.map(d => Math.max(
                          d.revenue || 0, 
                          d.cost || 0, 
                          d.expense || 0, 
                          Math.abs(d.profit || 0)
                        ))
                      );
                      const steps = 5;
                      return Array.from({ length: steps + 1 }, (_, i) => {
                        const value = Math.round((maxValue / steps) * i);
                        return (
                          <div key={i} className="flex items-center">
                            <span>{formatCurrency(value)}</span>
                            <div className="flex-1 h-px bg-gray-200 ml-2"></div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  
                  {/* Chart bars */}
                  <div className="absolute inset-0 flex items-end">
                    <svg className="w-full h-full" viewBox={`0 0 ${Math.max(statsData.length * 80, 300)} 200`} preserveAspectRatio="none">
                      {/* Grid lines */}
                      {Array.from({ length: 6 }, (_, i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 40}
                          x2={statsData.length * 80}
                          y2={i * 40}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Data bars */}
                      {statsData.map((day, index) => {
                        const maxValue = Math.max(
                          ...statsData.map(d => Math.max(
                            d.revenue || 0, 
                            d.cost || 0, 
                            d.expense || 0, 
                            Math.abs(d.profit || 0)
                          ))
                        );
                        const x = index * 80 + 10;
                        const barWidth = 20;
                        
                        const revenueHeight = maxValue > 0 ? ((day.revenue || 0) / maxValue) * 160 : 0;
                        const costHeight = maxValue > 0 ? ((day.cost || 0) / maxValue) * 160 : 0;
                        const expenseHeight = maxValue > 0 ? ((day.expense || 0) / maxValue) * 160 : 0;
                        const profitHeight = maxValue > 0 ? (Math.abs(day.profit || 0) / maxValue) * 160 : 0;
                        
                        return (
                          <g key={index}>
                            {/* Revenue bar */}
                            <rect
                              x={x}
                              y={200 - revenueHeight}
                              width={barWidth}
                              height={revenueHeight}
                              fill="#3b82f6"
                              opacity="0.8"
                            />
                            
                            {/* Cost bar */}
                            <rect
                              x={x + barWidth + 2}
                              y={200 - costHeight}
                              width={barWidth}
                              height={costHeight}
                              fill="#f59e0b"
                              opacity="0.8"
                            />
                            
                            {/* Expense bar */}
                            <rect
                              x={x + (barWidth + 2) * 2}
                              y={200 - expenseHeight}
                              width={barWidth}
                              height={expenseHeight}
                              fill="#ef4444"
                              opacity="0.8"
                            />
                            
                            {/* Profit bar */}
                            <rect
                              x={x + (barWidth + 2) * 3}
                              y={200 - profitHeight}
                              width={barWidth}
                              height={profitHeight}
                              fill={(day.profit || 0) >= 0 ? "#10b981" : "#ef4444"}
                              opacity="0.8"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="h-20 flex justify-between items-center mt-4">
                  {statsData.map((day, index) => (
                    <div key={index} className="flex-1 text-center">
                      <div className="text-xs text-gray-600 font-medium">
                        {formatDate(day.period)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <div className="text-blue-600">DT: {formatCurrency(day.revenue)}</div>
                        <div className="text-orange-600">CP: {formatCurrency(day.cost)}</div>
                        <div className="text-red-600">CH: {formatCurrency(day.expense)}</div>
                        <div className={getProfitColor(day.profit)}>LN: {formatCurrency(day.profit)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Chart Legend */}
            <div className="flex justify-center items-center mt-4 pt-4 border-t border-gray-200 space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Doanh Thu</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-600">Chi Phí</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Chi Phí Vận Hành</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Lợi Nhuận</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Expenses by Category */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Phân Tích Chi Phí Theo Danh Mục</h2>
            <div className="space-y-4">
              {Object.entries(expenses.byCategory).map(([category, data]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                      {category === 'inventory' ? 'Hàng Tồn Kho' : 
                       category === 'marketing' ? 'Marketing' :
                       category === 'operational' ? 'Vận Hành' :
                       category === 'salary' ? 'Lương' : category}
                    </h3>
                    <div className="text-2xl">
                      {category === 'inventory' ? '📦' : 
                       category === 'marketing' ? '📢' :
                       category === 'operational' ? '⚙️' :
                       category === 'salary' ? '👥' : '💰'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Số lượng:</span>
                      <span className="text-sm font-medium text-gray-900">{data.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tổng chi phí:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(data.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((data.amount / expenses.total) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {((data.amount / expenses.total) * 100).toFixed(1)}% tổng chi phí
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Tổng Chi Phí Vận Hành</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(expenses.total)}</span>
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Chỉ Số Tài Chính</h2>
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Biên Lợi Nhuận</h3>
                <div className={`text-3xl font-bold ${getProfitColor(actualProfit)}`}>
                  {actualProfitMargin}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {actualProfit === null ? 'Chưa có dữ liệu chi phí' : 
                   actualProfit >= 0 ? 'Doanh nghiệp có lãi' : 'Doanh nghiệp đang lỗ'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Doanh Thu TB</h4>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(Math.round(summary.totalRevenue / Math.max(statsData.length, 1)))}
                  </div>
                  <p className="text-xs text-gray-500">/ {period === 'daily' ? 'ngày' : 'tháng'}</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Chi Phí TB</h4>
                  <div className="text-lg font-bold text-orange-600">
                    {summary.totalCost !== null ? formatCurrency(Math.round(summary.totalCost / Math.max(statsData.length, 1))) : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-500">/ {period === 'daily' ? 'ngày' : 'tháng'}</p>
                </div>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Chi Phí Vận Hành TB</h4>
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(Math.round(summary.totalExpenses / Math.max(statsData.length, 1)))}
                </div>
                <p className="text-xs text-gray-500">/ {period === 'daily' ? 'ngày' : 'tháng'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Sản Phẩm Bán Chạy</h2>
          <div className="space-y-4">
            {topSellingProducts.map((item, index) => {
              const itemProfit = calculateProfit(item.revenue, item.cost);
              const itemProfitMargin = calculateProfitMargin(item.revenue, item.cost);
              
              return (
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
                    <p className="text-xs text-gray-400">
                      Lợi nhuận: {formatCurrency(itemProfit)} ({itemProfitMargin})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</p>
                    <p className="text-xs text-gray-500">Đơn giá: {formatCurrency(item.product.price)}</p>
                    <p className="text-xs text-gray-400">Chi phí: {formatCurrency(item.cost)}</p>
                  </div>
                  <div className="ml-4 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">#{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Tóm Tắt Tài Chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Tình Hình Chung</h3>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {actualProfit === null ? '❓ Chưa Rõ' : 
                 actualProfit >= 0 ? '📈 Tích Cực' : '📉 Cần Cải Thiện'}
              </div>
              <p className="text-sm text-blue-700">
                {actualProfit === null 
                  ? 'Cần cập nhật dữ liệu chi phí để đánh giá chính xác' 
                  : actualProfit >= 0 
                    ? 'Doanh nghiệp đang hoạt động có lãi' 
                    : 'Cần tối ưu chi phí và tăng doanh thu'}
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Hiệu Quả Kinh Doanh</h3>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {summary.totalOrders > 0 ? `${(summary.totalProductsSold / summary.totalOrders).toFixed(1)}` : '0'} SP/ĐH
              </div>
              <p className="text-sm text-green-700">
                Trung bình sản phẩm trên mỗi đơn hàng
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Khuyến Nghị</h3>
              <div className="text-lg font-bold text-purple-600 mb-2">
                {actualProfit === null ? '📝 Cập Nhật' : 
                 actualProfit >= 0 ? '🎯 Duy Trì' : '⚡ Tối Ưu'}
              </div>
              <p className="text-sm text-purple-700">
                {actualProfit === null 
                  ? 'Cần nhập dữ liệu chi phí sản phẩm để phân tích chính xác' 
                  : actualProfit >= 0 
                    ? 'Tiếp tục chiến lược hiện tại' 
                    : 'Cần cắt giảm chi phí và tăng doanh thu'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
