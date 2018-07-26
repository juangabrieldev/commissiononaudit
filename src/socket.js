import io from 'socket.io-client';

export const initializeSocket = () => {
  const socket = io('http://192.168.1.5:4000');

  return socket;
};