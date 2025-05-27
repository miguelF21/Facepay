import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Briefcase, Users, DollarSign, LogOut } from "lucide-react";

const Dashboard = () => {
  const totalEmpleados = 20;
  const totalDepartamentos = 5; 
  const montoNomina = 70_000; 

  const salidas = [
    { estado: "Applied", amount: 5 },
    { estado: "Pending", amount: 1 },
    { estado: "Approved", amount: 3 },
    { estado: "Rejected", amount: 1 },
  ];

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">Control Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <Users className="text-blue-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Employees</h2>
                <p className="text-xl font-semibold">{totalEmpleados}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <Briefcase className="text-green-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Departments</h2>
                <p className="text-xl font-semibold">{totalDepartamentos}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <DollarSign className="text-yellow-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Payroll</h2>
                <p className="text-xl font-semibold">${montoNomina.toLocaleString("es-CO")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <LogOut className="text-red-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Leaving Soticitudes</h2>
                <p className="text-xl font-semibold">
                  {salidas.reduce((acc, s) => acc + s.amount, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Leaving Details</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salidas}>
            <XAxis dataKey="estado" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
