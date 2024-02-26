import axios from "axios";
import { toast } from 'react-toastify';
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'http://localhost:8888'
});
instance.defaults.withCredentials = true;
// // Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;

// // Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// // Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const status = error && error.response && error.response.status || 500;
  switch (status) {

    // authentication(token related issues)
    case 401: {
      if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        toast.error('Unauthorized the user. Please login ...')
      }
      return error.response.data;
    }
    //forbidden (permisson related issues)
    case 403: {
      toast.error('Ban khong co quyen truy cap chuc nang nay')
      return Promise.reject(error);
      //return Promise.reject(new APIError(error.message, 403))
    }
    // bad reqest
    case 400: {
      return Promise.reject(error);
      // return Promise.reject(new APIError(error.message, 400))
    }
    //not found
    case 404: {
      return Promise.reject(error);
      //return Promise.reject(new APIError(error.message, 404))
    }
    // unprocessable
    case 422: {
      return Promise.reject(error);
      // return Promise.reject(new APIError(error.message, 422))
    }
    // conflict
    case 409: {
      return Promise.reject(error);
      //return Promise.reject(new APIError(error.message, 409))
    }
    default: {
      return Promise.reject(error);
      //return Promise.reject(new APIError(error.message, 500))
    }
  }

  return Promise.reject(error);
});

export default instance;