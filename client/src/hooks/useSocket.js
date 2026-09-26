import { useEffect, useState } from 'react';
import { useSocketContext } from '../context/SocketContext';

export const useSocket = (eventName) => {
  const { socket, connected } = useSocketContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!socket || !eventName) return;

    const handler = (payload) => {
      setData(payload);
    };

    socket.on(eventName, handler);
    return () => socket.off(eventName, handler);
  }, [socket, eventName]);

  return { data, connected };
};
