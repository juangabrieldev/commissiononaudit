import io from 'socket.io-client';
import { rootUrl } from "./api";

export const initializeSocket = () => {
  return io(rootUrl);
};

export const events = {
  departments: 'DEPARTMENTS',
  systemLogs: 'SYSTEM_LOGS'
};