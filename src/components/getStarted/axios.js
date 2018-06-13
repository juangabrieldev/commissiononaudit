import axios from 'axios';

import { endPoints } from '../../api';

export const employeeId = axios.create({
  baseURL: endPoints.registration.employeeId
});

export const username = axios.create({
  baseURL: endPoints.registration.username
});