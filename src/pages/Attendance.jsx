import { useState, useEffect } from 'react';
import { getAttendanceRecords } from '../services/employeeService';
import { connectRealtime } from '../services/realtimeService';

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date_from: new Date().toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    employee_id: ''
  });
  const [liveUpdates, setLiveUpdates] = useState(true);

  useEffect(() => {
    loadAttendance();
    
    let disconnectFn = null;
    
    if (liveUpdates) {
      try {
        disconnectFn = connectRealtime((event) => {
          if (event?.type === 'attendance_created' || event?.type === 'attendance_updated') {
            loadAttendance();
          }
        });
      } catch (err) {
        console.warn('Realtime connection failed:', err);
      }
    }
    
    return () => {
      if (disconnectFn && typeof disconnectFn === 'function') {
        try {
          disconnectFn();
        } catch (err) {
          console.warn('Disconnect failed:', err);
        }
      }
    };
  }, [filters, liveUpdates]);

  async function loadAttendance() {
    try {
      setLoading(true);
      setError(null);

      const response = await getAttendanceRecords(filters);

      if (response.error) {
        throw new Error(response.error);
      }

      let recordsArray = [];
      if (response.data) {
        recordsArray = Array.isArray(response.data) 
          ? response.data 
          : Object.values(response.data);
      }

      setAttendanceRecords(recordsArray);

    } catch (err) {
      console.error('Error loading attendance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(field, value) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

  const totalHours = attendanceRecords.reduce((sum, r) => sum + (r.hours_worked || 0), 0);
  const completeRecords = attendanceRecords.filter(r => r.status === 'complete').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Attendance Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Attendance Records
            </h1>
            <p className="text-gray-600 mt-2">Track employee check-ins and check-outs</p>
          </div>
          <button
            onClick={() => setLiveUpdates(!liveUpdates)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              liveUpdates 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {liveUpdates ? 'Live Updates ON' : 'Live Updates OFF'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                type="text"
                placeholder="Search by ID"
                value={filters.employee_id}
                onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadAttendance}
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{attendanceRecords.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Complete</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{completeRecords}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{totalHours.toFixed(1)}h</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance List</h2>
          
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-gray-500 text-lg">No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Check In</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Check Out</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Hours</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Terminal</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceRecords.map((record, index) => (
                      <tr key={record._id || index} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                              {(record.employee_name || 'N').charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{record.employee_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{record.employee_id || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.date || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatTime(record.check_in)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatTime(record.check_out)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                          {formatHours(record.hours_worked)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.source_terminal || 'manual'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={record.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    complete: {
      label: 'Complete',
      className: 'bg-green-100 text-green-800 border border-green-200'
    },
    incomplete: {
      label: 'In Progress',
      className: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }
  };

  const { label, className } = config[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${className}`}>
      {label}
    </span>
  );
}

function formatTime(isoString) {
  if (!isoString) return '-';
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
}

function formatHours(hours) {
  if (!hours && hours !== 0) return '-';
  return Number(hours).toFixed(2) + 'h';
}

export default Attendance;
