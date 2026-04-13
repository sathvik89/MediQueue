import axios from 'axios';

// Currently we will mock all the responses later in the service layer,
// but setting up the axios instance sets a good scalable foundation.
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
