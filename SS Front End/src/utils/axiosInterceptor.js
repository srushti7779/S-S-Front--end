import axios from "axios";
import { getAccessToken } from "./helper";

const AxiosInterceptors = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

AxiosInterceptors.interceptors.request.use(
  (request) => {
    let Request =
      getAccessToken() !== false
        ? {
            ...request,
            headers: {
              ...request.headers,
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        : request;

    return Request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosInterceptors.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInterceptors;
