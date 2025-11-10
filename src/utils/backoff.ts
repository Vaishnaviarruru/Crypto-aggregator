import axios from "axios";
import axiosRetry from "axios-retry";

// Configure axios to automatically retry failed requests
axiosRetry(axios, {
  retries: 3, // try up to 3 times
  retryCondition: (error) => {
    const status = error?.response?.status;
    // Retry on server errors (5xx) or rate limits (429)
    return !status || status >= 500 || status === 429;
  },
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s...
    return Math.min(1000 * 2 ** (retryCount - 1), 5000);
  },
});

export { axios };

