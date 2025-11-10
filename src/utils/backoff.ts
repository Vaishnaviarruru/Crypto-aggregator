import axios from "axios";
import axiosRetry from "axios-retry";

// Retry failed requests up to 3 times with linear/exponential delay
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000, // 1s, 2s, 3s
  retryCondition: (error) => {
    // retry on network errors or 5xx from remote API
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           (error.response?.status ?? 0) >= 500;
  },
});

export default axios;
