import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export interface SystemEvent {
  _id: string;
  topic: string;
  type: string;
  service: string;
  timestamp: string;
  payload: any;
  orderId: string;
}

interface SocketContextData {
  events: SystemEvent[];
  lastHeartbeats: Record<string, string>;
  connected: boolean;
  clearEvents: () => void;
}

const SocketContext = createContext<SocketContextData>({ events: [], lastHeartbeats: {}, connected: false, clearEvents: () => {} });
export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [lastHeartbeats, setLastHeartbeats] = useState<Record<string, string>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:5004");
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    
    let eventBuffer: SystemEvent[] = [];
    
    socket.on("system_event", (event: SystemEvent) => {
      eventBuffer.push(event);
    });

    // Throttle UI updates to once per 500ms to keep animations and Recharts responsive
    const flushInterval = setInterval(() => {
        if (eventBuffer.length > 0) {
            setEvents(prev => {
                const combined = [...eventBuffer, ...prev];
                return combined.slice(0, 100);
            });
            setLastHeartbeats(prev => {
                const updatedHeartbeats = { ...prev };
                eventBuffer.forEach(e => { 
                    updatedHeartbeats[e.service] = new Date().toISOString() 
                });
                return updatedHeartbeats;
            });
            eventBuffer = [];
        }
    }, 500);
    
    return () => { 
        clearInterval(flushInterval);
        socket.disconnect(); 
    };
  }, []);

  return (
    <SocketContext.Provider value={{ events, lastHeartbeats, connected, clearEvents: () => setEvents([]) }}>
      {children}
    </SocketContext.Provider>
  );
};
