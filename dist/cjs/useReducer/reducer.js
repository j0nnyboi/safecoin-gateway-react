"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.combineReducers = void 0;
const logger_1 = __importDefault(require("../logger"));
const types_1 = require("../types");
const utils_1 = require("./utils");
const combineReducers = (...reducers) => (state, action) => reducers.reduce((newState, reducer) => reducer(newState, action), state);
exports.combineReducers = combineReducers;
const reducer = (state, action) => {
    var _a;
    const gatewayStatus = (0, utils_1.statusFromToken)(state, state.gatewayToken) || types_1.GatewayStatus.UNKNOWN;
    const updatedState = Object.assign(Object.assign({}, state), { gatewayStatus });
    // eslint-disable-next-line no-prototype-builtins
    const tokenCreationInProgress = !!((_a = updatedState.civicPass.responsePayload) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(types_1.CivicPassMessageAction.ISSUANCE));
    logger_1.default.debug(`reducer.action: ${action.type}`, types_1.GatewayStatus[updatedState.gatewayStatus]);
    switch (action.type) {
        case 'startWalletPowo': {
            return Object.assign(Object.assign({}, updatedState), { walletPowoInProgress: true });
        }
        case 'walletPowoComplete': {
            logger_1.default.debug('tokenCreationInProgress', { tokenCreationInProgress });
            return Object.assign(Object.assign({}, updatedState), { 
                // only move to IN_REVIEW if it's during the initial token creation flow
                gatewayStatus: tokenCreationInProgress ? types_1.GatewayStatus.IN_REVIEW : updatedState.gatewayStatus, walletPowoInProgress: false, firstTokenCheck: false });
        }
        case 'walletPowoIncomplete': {
            logger_1.default.debug('tokenCreationInProgress', { tokenCreationInProgress });
            return Object.assign(Object.assign({}, state), { renderIframe: false, iframeMinimized: true, powoFinished: false, refreshTokenState: types_1.RefreshTokenState.IN_PROGRESS });
        }
        case 'tokenChange':
            return Object.assign(Object.assign({}, state), { gatewayStatus: (0, utils_1.statusFromToken)(state, action.token), powoFinished: false, gatewayToken: action.token, tokenIssuanceState: types_1.TokenIssuanceState.COMPLETED });
        case 'powoComplete':
            return Object.assign(Object.assign({}, updatedState), { gatewayStatus: types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP, powoFinished: true, powoRequested: undefined, refreshIntervalId: undefined, refreshTokenState: state.refreshTokenState === types_1.RefreshTokenState.IN_PROGRESS
                    ? types_1.RefreshTokenState.REQUIRES_POWO
                    : state.refreshTokenState });
        case 'walletDisconnected':
            return (0, utils_1.resetState)(state);
        case 'requestGatekeeperIssuance':
            return Object.assign(Object.assign({}, updatedState), { powoFinished: false, walletPowoInProgress: false, tokenIssuanceState: types_1.TokenIssuanceState.IN_PROGRESS });
        case 'requestGatekeeperIssuanceComplete':
            return Object.assign(Object.assign({}, updatedState), { tokenIssuanceState: types_1.TokenIssuanceState.COMPLETED });
        case 'requestGatekeeperIssuanceFailed':
            return Object.assign(Object.assign({}, (0, utils_1.resetState)(state)), { gatewayStatus: types_1.GatewayStatus.ERROR, tokenIssuanceState: types_1.TokenIssuanceState.FAILED });
        case 'refreshAttemptDone':
            return Object.assign(Object.assign({}, updatedState), { refreshInProgress: false });
        case 'updateStateWithProps':
            return Object.assign(Object.assign({}, state), { stage: action.stage, walletAddress: action.walletAddress, redirectUrl: action.redirectUrl, gatekeeperNetworkAddress: action.gatekeeperNetworkAddress });
        case 'tokenNotFoundError':
            return Object.assign(Object.assign({}, state), { renderIframe: false, iframeMinimized: true, gatewayStatus: types_1.GatewayStatus.ERROR });
        case 'gatekeeperNetworkChanged':
            return Object.assign(Object.assign({}, (0, utils_1.resetState)(state)), { gatekeeperNetworkAddress: action.gatekeeperNetworkAddress, walletAddress: state.walletAddress });
        default:
            return state;
    }
};
exports.reducer = reducer;
