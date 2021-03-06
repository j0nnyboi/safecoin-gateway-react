"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const logger_1 = __importDefault(require("../logger"));
const useWalletHooks_1 = __importDefault(require("./useWalletHooks"));
const usePowo = ({ wallet, chainImplementation }, state, dispatch) => {
    const { powoFinished, walletPowoInProgress, refreshInProgress } = state;
    const { expectWalletConnected } = (0, useWalletHooks_1.default)(wallet, state, dispatch);
    /**
     * wait until the user has confirmed they want to continue the proof of wallet ownership flow
     * then resolve the promise
     */
    const waitForConfirmPOWO = (0, react_1.useCallback)(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async (payload) => {
        logger_1.default.debug('usePowo waitForConfirmPOWO before expectWalletConnected', {
            payload,
        });
        expectWalletConnected();
        return new Promise((resolve) => {
            logger_1.default.debug('usePowo waitForConfirmPOWO', { powoFinished });
            if (powoFinished) {
                resolve(payload);
            }
        });
    }, [powoFinished, expectWalletConnected]);
    /**
     * wait until the user has provided proof of wallet ownership using their connected wallet
     * if this was triggered from the refresh flow, dispatch events to indicate progress
     * if not, resolve a promise when the proof is ready
     */
    const waitForPOWO = (0, react_1.useCallback)(async (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    payload) => {
        logger_1.default.debug('usePowo waitForPOWO before expectWalletConnected');
        const connectedWallet = expectWalletConnected();
        if (connectedWallet) {
            logger_1.default.debug('usePowo waitForPOWO', {
                payload,
                publicKey: connectedWallet.publicKey,
            });
            return new Promise((resolve) => {
                logger_1.default.debug('usePowo waitForPOWO walletPowoInProgress', {
                    walletPowoInProgress,
                    refreshInProgress,
                });
                chainImplementation
                    .proveWalletOwnership()
                    .then((proof) => {
                    resolve({ proof, payload });
                    dispatch({ type: 'walletPowoComplete' });
                    dispatch({ type: 'civicPass_check_token_status' });
                })
                    .catch((error) => {
                    logger_1.default.error('Proof of wallet ownership error: ', error);
                    dispatch({ type: 'walletPowoIncomplete' });
                });
            });
        }
        return {};
    }, [expectWalletConnected, walletPowoInProgress, chainImplementation]);
    return {
        waitForConfirmPOWO,
        waitForPOWO,
    };
};
exports.default = usePowo;
