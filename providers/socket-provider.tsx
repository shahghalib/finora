'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from '@/components/ui/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import type { BudgetAlert } from '@/lib/types';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, isConnected: false });
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      // Any previous socket was already disconnected by this effect's own
      // cleanup (below) when `token` changed — this just resets the state
      // exposed to consumers so stale connection info doesn't linger after
      // logout.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('budgetAlert', (alert: BudgetAlert) => {
      const isFull = alert.thresholdType === '100pct';

      toast.add({
        title: isFull ? '🚨 Budget Exceeded' : '⚠️ Budget Warning',
        description: isFull
          ? `You've gone over budget — PKR ${alert.totalSpent.toLocaleString()} of PKR ${alert.limitAmount.toLocaleString()} spent.`
          : `You've hit ${alert.pctUsed}% of your budget for this category.`,
        type: isFull ? 'error' : 'warning',
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
