import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Sidebar } from '../Sidebar';
import { Toaster } from '../ui/toaster';

export function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
