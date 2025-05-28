
import React from 'react';

function Payroll() {
  const payroll = [
    { name: 'Miguel Fuentes', hours: 76, payment: '$1,520' },
    { name: 'Juan Pérez', hours: 80, payment: '$2,000' },
    { name: 'Ana López', hours: 78, payment: '$1,600' },
    { name: 'Pedro García', hours: 70, payment: '$1,400' },
  ];

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl animate-fade-in-up">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
        Payroll Summary
      </h1>

      {payroll.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Employee Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Hours Worked
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Pay
                </th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p, i) => (
                <tr key={i} className="bg-white border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    {p.name}
                  </td>
                  <td className="py-4 px-6">
                    {p.hours}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-green-700">
                    {p.payment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-8">
          No payroll records available
        </p>
      )}
    </div>
  );
}

export default Payroll;