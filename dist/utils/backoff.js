"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
// Retry failed requests up to 3 times with linear/exponential delay
(0, axios_retry_1.default)(axios_1.default, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000, // 1s, 2s, 3s
    retryCondition: (error) => {
        // retry on network errors or 5xx from remote API
        return axios_retry_1.default.isNetworkOrIdempotentRequestError(error) ||
            (error.response?.status ?? 0) >= 500;
    },
});
exports.default = axios_1.default;
