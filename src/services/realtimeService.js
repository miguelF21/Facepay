let socket = null;
let socketIoModule = null;

export async function connectRealtime(onMessage) {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

  try {
    if (!socketIoModule) {
      socketIoModule = await import('socket.io-client');
    }

    const { io } = socketIoModule;

    socket = io(wsUrl, { 
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      if (onMessage) onMessage({ type: 'connected', message: 'Connected' });
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      if (onMessage) onMessage({ type: 'error', message: 'Connection error' });
    });

    socket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
      if (onMessage) onMessage({ type: 'disconnected', message: 'Disconnected' });
    });

    socket.on('db_change', (payload) => {
      console.log('Database change:', payload);
      if (onMessage) onMessage(payload);
    });

    socket.on('employee_created', (payload) => {
      console.log('Employee created:', payload);
      if (onMessage) onMessage({ type: 'employee_created', payload });
    });

    socket.on('employee_updated', (payload) => {
      console.log('Employee updated:', payload);
      if (onMessage) onMessage({ type: 'employee_updated', payload });
    });

    socket.on('employee_deleted', (payload) => {
      console.log('Employee deleted:', payload);
      if (onMessage) onMessage({ type: 'employee_deleted', payload });
    });

    socket.on('attendance_created', (payload) => {
      console.log('Attendance registered:', payload);
      if (onMessage) onMessage({ type: 'attendance_created', payload });
    });

    socket.on('attendance_updated', (payload) => {
      console.log('Attendance updated:', payload);
      if (onMessage) onMessage({ type: 'attendance_updated', payload });
    });

    socket.on('payroll_calculated', (payload) => {
      console.log('Payroll calculated:', payload);
      if (onMessage) onMessage({ type: 'payroll_calculated', payload });
    });

    return function disconnect() {
      if (socket) {
        console.log('Disconnecting WebSocket...');
        socket.disconnect();
        socket = null;
      }
    };

  } catch (error) {
    console.error('Error connecting WebSocket:', error);
    console.warn('WebSocket not available. Install: npm install socket.io-client');
    
    return function disconnect() {
      console.log('No connection to disconnect');
    };
  }
}

export function disconnectRealtime() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('WebSocket disconnected manually');
  }
}

export function isConnected() {
  return socket?.connected ?? false;
}

export default {
  connectRealtime,
  disconnectRealtime,
  isConnected
};
