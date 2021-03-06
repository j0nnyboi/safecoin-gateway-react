"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusFromToken = exports.resetState = void 0;
const types_1 = require("../types");
// eslint-disable-next-line import/prefer-default-export
const resetState = (state) => (Object.assign(Object.assign({}, state), { gatewayStatus: types_1.GatewayStatus.UNKNOWN, tokenRequested: false, iframeMinimized: false, firstTokenCheck: true, renderIframe: false, gatewayToken: undefined, powoRequested: undefined, refreshIntervalId: undefined, powoFinished: false, refreshInProgress: false, tokenIssuanceState: types_1.TokenIssuanceState.NOT_REQUESTED, walletToRefresh: undefined, walletPowoInProgress: false, gatekeeperRecordState: undefined, civicPass: {
        status: types_1.CivicPassIssuanceStatus.NOT_REQUESTED,
        iframeMinimized: false,
        renderIframe: false,
    } }));
exports.resetState = resetState;
const hasExpired = (gatewayToken) => {
    const now = Math.floor(Date.now() / 1000);
    return !!gatewayToken.expiryTime && now >= gatewayToken.expiryTime;
};
const isLocationNotSupported = (recordState) => {
    if (!recordState)
        return false;
    return [types_1.GatekeeperRecordState.LOCATION_NOT_SUPPORTED].includes(recordState);
};
const isIssuedLocationNotSupported = (recordState) => {
    if (!recordState)
        return false;
    return [types_1.GatekeeperRecordState.ISSUED_LOCATION_NOT_SUPPORTED].includes(recordState);
};
const statusFromToken = (state, gatewayToken) => {
    if (!gatewayToken)
        return state.gatewayStatus;
    switch (gatewayToken.state) {
        case types_1.State.ACTIVE:
            if (isLocationNotSupported(state.gatekeeperRecordState)) {
                return types_1.GatewayStatus.LOCATION_NOT_SUPPORTED;
            }
            if (isIssuedLocationNotSupported(state.gatekeeperRecordState)) {
                return types_1.GatewayStatus.REFRESH_TOKEN_REQUIRED;
            }
            if (state.gatewayStatus === types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP) {
                return types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP;
            }
            return hasExpired(gatewayToken) ? types_1.GatewayStatus.REFRESH_TOKEN_REQUIRED : types_1.GatewayStatus.ACTIVE;
        case types_1.State.REVOKED:
            return types_1.GatewayStatus.REVOKED;
        case types_1.State.FROZEN:
            return types_1.GatewayStatus.FROZEN;
        default:
            return types_1.GatewayStatus.UNKNOWN;
    }
};
exports.statusFromToken = statusFromToken;
