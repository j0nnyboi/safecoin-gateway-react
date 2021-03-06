"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const logger_1 = __importDefault(require("../logger"));
const useWalletHooks_1 = __importDefault(require("./useWalletHooks"));
const useGatekeeper = ({ wallet, stage, gatekeeperClient, }, state, dispatch) => {
    const { expectWalletConnected } = (0, useWalletHooks_1.default)(wallet, state, dispatch);
    const { gatekeeperNetworkAddress } = state;
    /**
     * if a request is not already in progress, initiate a request to the gatekeeper for a new token
     * and dispatch an event so we know it's in progress
     */
    const waitForGatekeeperIssuanceRequest = (0, react_1.useCallback)(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async ({ payload, proof }) => {
        const connectedWallet = expectWalletConnected();
        if (connectedWallet) {
            logger_1.default.debug('waitForGatekeeperIssuanceRequest ready to call requestGatewayTokenFromGatekeeper', {
                payload,
            });
            dispatch({ type: 'requestGatekeeperIssuance' });
            const requestGatewayTokenFromGatekeeperResult = await gatekeeperClient().requestGatewayTokenFromGatekeeper({
                wallet: connectedWallet,
                payload,
                proof,
            });
            logger_1.default.debug('requestGatewayTokenFromGatekeeperResult', requestGatewayTokenFromGatekeeperResult);
            if (requestGatewayTokenFromGatekeeperResult.status >= 400) {
                logger_1.default.error('Error requesting token from gatekeeper');
                dispatch({ type: 'requestGatekeeperIssuanceFailed' });
                throw new Error('Error requesting token from gatekeeper');
            }
            logger_1.default.debug('Successfully created gatekeeper token');
            dispatch({ type: 'requestGatekeeperIssuanceComplete' });
        }
    }, [gatekeeperClient, expectWalletConnected, stage]);
    /**
     * Update the state when the Gatekeeper network changes
     */
    (0, react_1.useEffect)(() => {
        if (wallet && wallet.publicKey && gatekeeperNetworkAddress) {
            dispatch({ type: 'gatekeeperNetworkChanged', gatekeeperNetworkAddress });
        }
    }, [gatekeeperNetworkAddress]);
    return {
        waitForGatekeeperIssuanceRequest,
        gatekeeperClient,
    };
};
exports.default = useGatekeeper;
