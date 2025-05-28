// Attendance.jsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LogIn, LogOut, Calendar, Clock } from 'lucide-react';

function Attendance() {
  const records = [
    { name: 'Miguel Fuentes', type: 'Entry', time: '08:05 AM', date: '2025-04-12' },
    { name: 'Miguel Fuentes', type: 'Exit', time: '05:01 PM', date: '2025-04-12' },
    { name: 'Juan Pérez', type: 'Entry', time: '08:03 AM', date: '2025-04-12' },
    { name: 'Juan Pérez', type: 'Exit', time: '05:00 PM', date: '2025-04-12' },
    { name: 'Ana López', type: 'Entry', time: '08:10 AM', date: '2025-04-13' },
    { name: 'Ana López', type: 'Exit', time: '05:05 PM', date: '2025-04-13' },
    { name: 'Pedro García', type: 'Entry', time: '08:00 AM', date: '2025-04-13' },
    { name: 'Pedro García', type: 'Exit', time: '05:15 PM', date: '2025-04-13' },
  ];

  return (
    // Outer container for layout adjustment (assuming sidebar is on the left)
    <div className="flex-1 p-8 lg:ml-64 min-h-screen bg-gray-50"> {/* Added bg-gray-50 for subtle background */}
      {/* Inner container to center content within the available space */}
      <div className="max-w-6xl mx-auto grid gap-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight drop-shadow-sm"
        >
          Attendance Records
        </motion.h1>

        {records.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {records.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              >
                <Card className="rounded-2xl p-6 shadow-lg border border-gray-200 h-full flex flex-col justify-between">
                  <CardContent className="p-0 flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-2">
                      {record.type === 'Entry' ? (
                        <LogIn className="w-8 h-8 text-green-500 bg-green-100 p-1 rounded-full" />
                      ) : (
                        <LogOut className="w-8 h-8 text-red-500 bg-red-100 p-1 rounded-full" />
                      )}
                      <h2 className={`text-xl font-bold ${record.type === 'Entry' ? 'text-green-700' : 'text-red-700'}`}>
                        {record.type}
                      </h2>
                    </div>

                    <p className="text-lg font-semibold text-gray-800">{record.name}</p>

                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{record.time}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{record.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg py-12">
            No attendance records available.
          </p>
        )}
      </div>
    </div>
  );
}

export default Attendance;