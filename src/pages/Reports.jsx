import { useState, useEffect } from 'react';
import { getAttendanceReport, getPayrollReport } from '../services/employeeService';

function Reports() {
  const [reportType, setReportType] = useState('attendance');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date_from: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    period: getCurrentPeriod()
  });

  function getCurrentPeriod() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  async function generateReport() {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (reportType === 'attendance') {
        response = await getAttendanceReport({
          date_from: filters.date_from,
          date_to: filters.date_to
        });
      } else {
        response = await getPayrollReport({
          period: filters.period
        });
      }

      if (response.error) {
        throw new Error(response.error);
      }

      setReportData(response.data);

    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function exportToPDF() {
    alert('PDF export feature coming soon!');
  }

  function exportToExcel() {
    if (!reportData) return;
    
    const records = reportData.records || [];
    const csvContent = convertToCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${Date.now()}.csv`;
    a.click();
  }

  function convertToCSV(records) {
    if (records.length === 0) return '';
    
    const headers = Object.keys(records[0]).join(',');
    const rows = records.map(record => 
      Object.values(record).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">Generate detailed workforce reports</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Report Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="attendance">Attendance Report</option>
                <option value="payroll">Payroll Report</option>
              </select>
            </div>

            {reportType === 'attendance' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <input
                  type="month"
                  value={filters.period}
                  onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {reportData && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={exportToExcel}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export CSV
              </button>
              <button
                onClick={exportToPDF}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Export PDF
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Generating report...</p>
          </div>
        )}

        {reportData && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {reportType === 'attendance' ? 'Attendance Report' : 'Payroll Report'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm font-medium opacity-90 mb-2">Total Records</p>
                <p className="text-4xl font-bold">{reportData.total_records || 0}</p>
              </div>
              
              {reportType === 'attendance' ? (
                <>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90 mb-2">Complete</p>
                    <p className="text-4xl font-bold">{reportData.complete || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90 mb-2">Incomplete</p>
                    <p className="text-4xl font-bold">{reportData.incomplete || 0}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90 mb-2">Total Gross</p>
                    <p className="text-4xl font-bold">${(reportData.total_gross || 0).toLocaleString('en-US')}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90 mb-2">Total Net</p>
                    <p className="text-4xl font-bold">${(reportData.total_net || 0).toLocaleString('en-US')}</p>
                  </div>
                </>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      {reportType === 'attendance' ? (
                        <>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Check In</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Check Out</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Hours</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Period</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Base Salary</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Deductions</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Net Salary</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(reportData.records || []).map((record, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.employee_name}</div>
                          <div className="text-sm text-gray-500">{record.employee_id}</div>
                        </td>
                        {reportType === 'attendance' ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{record.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTime(record.check_in)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTime(record.check_out)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{formatHours(record.hours_worked)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                record.status === 'complete' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{record.period}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${(record.base_salary || 0).toLocaleString('en-US')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">${(record.total_deductions || 0).toLocaleString('en-US')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">${(record.net_salary || 0).toLocaleString('en-US')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                record.status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!reportData && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <svg className="w-32 h-32 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Report Generated</h3>
            <p className="text-gray-600">Select report type and filters, then click Generate Report</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(isoString) {
  if (!isoString) return '-';
  try {
    return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '-';
  }
}

function formatHours(hours) {
  if (!hours && hours !== 0) return '-';
  return Number(hours).toFixed(2) + 'h';
}

export default Reports;
