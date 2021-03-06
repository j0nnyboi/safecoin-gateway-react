"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenRefreshIntervalMilliseconds = exports.isTokenRefreshRequired = exports.hasExpired = void 0;
/* eslint-disable import/prefer-default-export */
const logger_1 = __importDefault(require("../logger"));
const isApproachingExpiry = (currentExpiry, tokenExpirationMarginSeconds) => {
    const now = Math.floor(Date.now() / 1000);
    logger_1.default.debug('checking if the token is approaching expiry', {
        tokenExpirationMarginSeconds,
        currentExpiry,
        now,
        approachingExpiryResult: currentExpiry - now < tokenExpirationMarginSeconds,
    });
    return currentExpiry - now < tokenExpirationMarginSeconds;
};
const hasExpired = (expiryTime) => {
    if (!expiryTime)
        return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= expiryTime;
};
exports.hasExpired = hasExpired;
const isTokenRefreshRequired = ({ gatewayToken, tokenExpirationMarginSeconds, }) => {
    const { expiryTime } = gatewayToken;
    if (!expiryTime)
        return false;
    return (0, exports.hasExpired)(expiryTime) || isApproachingExpiry(expiryTime, tokenExpirationMarginSeconds);
};
exports.isTokenRefreshRequired = isTokenRefreshRequired;
const getTokenRefreshIntervalMilliseconds = (expiryTime, tokenExpirationMarginSeconds) => {
    const now = Math.floor(Date.now() / 1000);
    const interval = expiryTime - now - tokenExpirationMarginSeconds;
    return interval > 0 ? interval * 1000 : 0;
};
exports.getTokenRefreshIntervalMilliseconds = getTokenRefreshIntervalMilliseconds;
