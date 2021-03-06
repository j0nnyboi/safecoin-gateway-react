"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
const react_1 = require("react");
const logger_1 = __importDefault(require("../logger"));
const types_1 = require("../types");
const config_1 = require("../config");
const utils_1 = require("../useReducer/utils");
const gatewayStatusToCivicPassAction = {
    [types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP]: types_1.CivicPassMessageAction.PROOF_OF_WALLET_OWNERSHIP,
    [types_1.GatewayStatus.IN_REVIEW]: types_1.CivicPassMessageAction.TOKEN_IN_REVIEW,
    [types_1.GatewayStatus.ERROR]: types_1.CivicPassMessageAction.ISSUANCE,
    [types_1.GatewayStatus.ACTIVE]: types_1.CivicPassMessageAction.TOKEN_ACTIVE,
    [types_1.GatewayStatus.REVOKED]: types_1.CivicPassMessageAction.TOKEN_REVOKED,
    [types_1.GatewayStatus.FROZEN]: types_1.CivicPassMessageAction.TOKEN_FROZEN,
    [types_1.GatewayStatus.REJECTED]: types_1.CivicPassMessageAction.TOKEN_REJECTED,
    [types_1.GatewayStatus.LOCATION_NOT_SUPPORTED]: types_1.CivicPassMessageAction.FAILED_IP_CHECK,
    [types_1.GatewayStatus.REFRESH_TOKEN_REQUIRED]: types_1.CivicPassMessageAction.REFRESH,
    [types_1.GatewayStatus.CHECKING]: types_1.CivicPassMessageAction.STATUS,
    [types_1.GatewayStatus.NOT_REQUESTED]: types_1.CivicPassMessageAction.ISSUANCE,
    [types_1.GatewayStatus.COLLECTING_USER_INFORMATION]: types_1.CivicPassMessageAction.ISSUANCE,
    [types_1.GatewayStatus.VALIDATING_USER_INFORMATION]: types_1.CivicPassMessageAction.ISSUANCE,
    [types_1.GatewayStatus.USER_INFORMATION_VALIDATED]: types_1.CivicPassMessageAction.ISSUANCE,
    [types_1.GatewayStatus.USER_INFORMATION_REJECTED]: types_1.CivicPassMessageAction.ISSUANCE,
};
const validationProcessToGatewayStatus = {
    [types_1.ValidationStatus.COLLECTING]: types_1.GatewayStatus.COLLECTING_USER_INFORMATION,
    [types_1.ValidationStatus.PROCESSING]: types_1.GatewayStatus.VALIDATING_USER_INFORMATION,
    [types_1.ValidationStatus.IN_REVIEW]: types_1.GatewayStatus.VALIDATING_USER_INFORMATION,
    [types_1.ValidationStatus.FAILED]: types_1.GatewayStatus.USER_INFORMATION_REJECTED,
    [types_1.ValidationStatus.NOT_FOUND]: types_1.GatewayStatus.NOT_REQUESTED,
    [types_1.ValidationStatus.COMPLETED]: types_1.GatewayStatus.USER_INFORMATION_VALIDATED,
};
const logDebug = (message, obj = null) => logger_1.default.debug(`[useCivicPass] ${message}`, obj);
const logError = (message, obj = null) => logger_1.default.error(`[useCivicPass] ${message}`, obj);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getCivicPassSrcUrl = (state, status) => {
    const { redirectUrl, gatekeeperNetworkAddress, stage, walletAddress, civicPass, chainType } = state;
    if (!gatekeeperNetworkAddress || !walletAddress) {
        logError('Required properties not present', { gatekeeperNetworkAddress, walletAddress });
        throw new Error(`Required properties not present ${{ gatekeeperNetworkAddress, walletAddress }}`);
    }
    const civicPassSrcUrl = (0, config_1.getCivicPassEndpoint)(stage);
    const url = new URL(civicPassSrcUrl);
    const action = gatewayStatusToCivicPassAction[status];
    const searchParams = new URLSearchParams(Object.assign(Object.assign({}, civicPass.requestPayload), { redirectUrl, networkAddress: gatekeeperNetworkAddress, action, wallet: walletAddress, chain: chainType }));
    logDebug('Civic pass query params', { searchParams: searchParams.toString(), gatewayStatus: types_1.GatewayStatus[status] });
    return `${url.href}?${searchParams.toString()}`;
};
const reducer = (state, action) => {
    var _a;
    switch (action.type) {
        case 'civicPass_check_token_status': {
            return Object.assign(Object.assign({}, state), { tokenRequested: true, iframeMinimized: !((_a = state.options) === null || _a === void 0 ? void 0 : _a.autoShowModal), renderIframe: true, iframeSrcUrl: state.civicPass.status === types_1.CivicPassIssuanceStatus.REQUESTED
                    ? state.iframeSrcUrl
                    : getCivicPassSrcUrl(state, (0, utils_1.statusFromToken)(state, action.token)) });
        }
        case 'civicPass_check_status': {
            return Object.assign(Object.assign({}, state), { iframeMinimized: true, renderIframe: true, gatewayStatus: types_1.GatewayStatus.CHECKING, iframeSrcUrl: getCivicPassSrcUrl(state, types_1.GatewayStatus.CHECKING) });
        }
        case 'civicPass_check_status_complete': {
            const { payload } = action.payload;
            const { status } = payload;
            const gatewayStatus = validationProcessToGatewayStatus[status];
            return Object.assign(Object.assign({}, state), { iframeMinimized: true, renderIframe: false, gatewayStatus });
        }
        case 'userInteraction_check_gatewayToken_status': {
            return Object.assign(Object.assign({}, state), { tokenRequested: true, iframeMinimized: false, renderIframe: true, iframeSrcUrl: state.civicPass.status === types_1.CivicPassIssuanceStatus.REQUESTED
                    ? state.iframeSrcUrl
                    : getCivicPassSrcUrl(state, (0, utils_1.statusFromToken)(state, action.token)) });
        }
        case 'civicPass_close':
            return Object.assign({}, (state.civicPass.status === types_1.CivicPassIssuanceStatus.REQUESTED
                ? Object.assign(Object.assign({}, state), { iframeMinimized: true, renderIframe: true }) : Object.assign(Object.assign({}, state), { iframeMinimized: true, renderIframe: false })));
        case 'civicPass_in_progress': {
            return Object.assign(Object.assign({}, state), { gatewayStatus: types_1.GatewayStatus.COLLECTING_USER_INFORMATION, renderIframe: true, iframeMinimized: false, civicPass: Object.assign(Object.assign({}, state.civicPass), { status: types_1.CivicPassIssuanceStatus.REQUESTED }) });
        }
        case 'civicPass_issuance_success': {
            const { payload, requiresProofOfWalletOwnership } = action.payload;
            const gatewayStatus = requiresProofOfWalletOwnership
                ? types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP
                : types_1.GatewayStatus.IN_REVIEW;
            return Object.assign(Object.assign({}, state), { gatewayStatus, renderIframe: true, iframeMinimized: false, powoRequested: 'solana', iframeSrcUrl: getCivicPassSrcUrl(state, gatewayStatus), civicPass: Object.assign(Object.assign({}, state.civicPass), { status: types_1.CivicPassIssuanceStatus.VERIFIED, responsePayload: {
                        [types_1.CivicPassMessageAction.ISSUANCE]: {
                            payload,
                            requiresProofOfWalletOwnership,
                        },
                    } }) });
        }
        case 'civicPass_issuance_failure':
            return Object.assign(Object.assign({}, (0, utils_1.resetState)(state)), { gatewayStatus: types_1.GatewayStatus.ERROR });
        case 'civicPass_issuance_cancelled':
            return Object.assign(Object.assign({}, (0, utils_1.resetState)(state)), { gatewayStatus: types_1.GatewayStatus.NOT_REQUESTED });
        case 'civicPass_refresh_success': {
            const { payload, requiresProofOfWalletOwnership } = action.payload;
            const gatewayStatus = requiresProofOfWalletOwnership
                ? types_1.GatewayStatus.PROOF_OF_WALLET_OWNERSHIP
                : types_1.GatewayStatus.IN_REVIEW;
            return Object.assign(Object.assign({}, state), { gatewayStatus, renderIframe: true, iframeMinimized: false, iframeSrcUrl: getCivicPassSrcUrl(state, gatewayStatus), refreshTokenState: types_1.RefreshTokenState.IN_PROGRESS, civicPass: Object.assign(Object.assign({}, state.civicPass), { responsePayload: {
                        [types_1.CivicPassMessageAction.REFRESH]: {
                            payload,
                            requiresProofOfWalletOwnership,
                        },
                    } }) });
        }
        case 'civicPass_refresh_cancelled':
            return Object.assign(Object.assign({}, (0, utils_1.resetState)(state)), { refreshTokenState: types_1.RefreshTokenState.CANCELLED, gatewayStatus: types_1.GatewayStatus.REFRESH_TOKEN_REQUIRED });
        case 'civicPass_refresh_failure':
            return Object.assign(Object.assign({}, (0, utils_1.resetState)(state)), { refreshTokenState: types_1.RefreshTokenState.FAILED, gatewayStatus: types_1.GatewayStatus.ERROR });
        case 'civicPass_location_not_supported':
            return Object.assign(Object.assign({}, state), { iframeMinimized: true, renderIframe: false, gatewayStatus: state.gatewayStatus, refreshTokenState: state.gatekeeperRecordState === types_1.GatekeeperRecordState.ISSUED_LOCATION_NOT_SUPPORTED
                    ? types_1.RefreshTokenState.REQUIRES_POWO
                    : state.refreshTokenState });
        default:
            return state;
    }
};
exports.reducer = reducer;
const useCivicPass = ({ wallet }, state, dispatch) => {
    const { gatekeeperRecordState } = state;
    const getActionForIssuanceResponse = (response) => {
        const actions = {
            [types_1.CivicPassMessageEventResult.SUCCESS]: {
                type: 'civicPass_issuance_success',
                payload: response,
            },
            [types_1.CivicPassMessageEventResult.FAILURE]: {
                type: 'civicPass_issuance_failure',
            },
            [types_1.CivicPassMessageEventResult.CANCELLED]: {
                type: 'civicPass_issuance_cancelled',
            },
            [types_1.CivicPassMessageEventResult.IN_PROGRESS]: {
                type: 'civicPass_in_progress',
            },
        };
        return actions[response.event];
    };
    const getActionForRefreshResponse = (response) => {
        const actions = {
            [types_1.CivicPassMessageEventResult.SUCCESS]: {
                type: 'civicPass_refresh_success',
                payload: response,
            },
            [types_1.CivicPassMessageEventResult.CANCELLED]: {
                type: 'civicPass_refresh_cancelled',
            },
            [types_1.CivicPassMessageEventResult.FAILURE]: {
                type: 'civicPass_refresh_failure',
            },
        };
        return actions[response.event];
    };
    const getActionForPowoResponse = (response) => {
        const actions = {
            [types_1.CivicPassMessageEventResult.SUCCESS]: {
                type: 'powoComplete',
            },
        };
        return actions[response.event];
    };
    const getActionForLocationNotSupportedResponse = (response) => {
        const actions = {
            [types_1.CivicPassMessageEventResult.SUCCESS]: {
                type: 'civicPass_location_not_supported',
            },
        };
        return actions[response.event];
    };
    const getActionForStaticResponse = (response) => {
        const actions = {
            [types_1.CivicPassMessageEventResult.SUCCESS]: {
                type: 'civicPass_close',
            },
        };
        return actions[response.event];
    };
    const getActionForStatusResponse = (response) => {
        const actions = {
            [types_1.CivicPassMessageEventResult.SUCCESS]: {
                type: 'civicPass_check_status_complete',
                payload: response,
            },
        };
        return actions[response.event];
    };
    const dispatchComplianceEventResult = (response) => {
        const actions = {
            [types_1.CivicPassMessageAction.ISSUANCE]: getActionForIssuanceResponse(response),
            [types_1.CivicPassMessageAction.PROOF_OF_WALLET_OWNERSHIP]: getActionForPowoResponse(response),
            [types_1.CivicPassMessageAction.TOKEN_IN_REVIEW]: getActionForStaticResponse(response),
            [types_1.CivicPassMessageAction.TOKEN_ACTIVE]: getActionForStaticResponse(response),
            [types_1.CivicPassMessageAction.TOKEN_FROZEN]: getActionForStaticResponse(response),
            [types_1.CivicPassMessageAction.TOKEN_REJECTED]: getActionForStaticResponse(response),
            [types_1.CivicPassMessageAction.TOKEN_REVOKED]: getActionForStaticResponse(response),
            [types_1.CivicPassMessageAction.FAILED_IP_CHECK]: getActionForLocationNotSupportedResponse(response),
            [types_1.CivicPassMessageAction.REFRESH]: getActionForRefreshResponse(response),
            [types_1.CivicPassMessageAction.STATUS]: getActionForStatusResponse(response),
        };
        const action = actions[response.action];
        if (action) {
            logDebug('Successfully processed compliance event with action', action);
            dispatch(action);
        }
    };
    /**
     * Listen for post messages from the compliance iframe and dispatch events
     * based on the event type
     */
    (0, react_1.useEffect)(() => {
        if (wallet && wallet.publicKey) {
            logDebug('Current state', state);
            const handler = async (response) => {
                dispatchComplianceEventResult(response.data);
            };
            window.addEventListener('message', handler);
            return () => {
                logDebug('Removing event listener for compliance');
                return window.removeEventListener('message', handler);
            };
        }
        return () => { };
    }, []);
    /**
     * We do not have a token and user is connecting from an unsupported country,
     * so we show the country not supported screen
     */
    (0, react_1.useEffect)(() => {
        if (gatekeeperRecordState === types_1.GatekeeperRecordState.LOCATION_NOT_SUPPORTED) {
            dispatch({ type: 'civicPass_check_token_status' });
        }
    }, [gatekeeperRecordState]);
    /**
     * Check for the ongoing KYC status
     */
    (0, react_1.useEffect)(() => {
        if (gatekeeperRecordState === types_1.GatekeeperRecordState.NOT_REQUESTED) {
            dispatch({ type: 'civicPass_check_status' });
        }
    }, [gatekeeperRecordState]);
    return { dispatchComplianceEventResult };
};
exports.default = useCivicPass;
