import io from 'socket.io-client';
import { rootUrl } from "./api";

export const initializeSocket = () => {
  return io(rootUrl);
};

export const events = {
  office: 'OFFICE',
  systemLogs: 'SYSTEM_LOGS',
  qualificationStandards: 'QUALIFICATION_STANDARDS'
};