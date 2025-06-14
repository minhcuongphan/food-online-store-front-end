import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Error Response:', error.response.data);
      alert(`Error: ${error.response.data.message || 'Something went wrong!'}`);
    } else if (error.request) {
      console.error('Error Request:', error.request);
      alert('Error: No response from the server. Please try again later.');
    } else {
      console.error('Error Message:', error.message);
      alert(`Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;