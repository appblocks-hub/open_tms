import axios from 'axios';

const APP_ENTRYPOINT = process.env.BB_AUTH_FUNCTION_URL;

const request = axios.create({
  baseURL: APP_ENTRYPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { request };
