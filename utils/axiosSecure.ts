import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosSecure.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      return axiosSecure(error.config);
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
