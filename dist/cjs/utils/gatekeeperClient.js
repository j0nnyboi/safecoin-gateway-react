"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_retry_ts_1 = __importDefault(require("fetch-retry-ts"));
const types_1 = require("../types");
const logger_1 = __importDefault(require("../logger"));
const config_1 = require("../config");
const version_1 = __importDefault(require("./version"));
const testRetryMultipler = () => parseFloat(process.env.TEST_RETRY_MULTIPLIER || '') || 1;
const defaultHeaders = {
    'X-Civic-Client': `${(0, version_1.default)()}`,
};
class GatekeeperClient {
    constructor(gatekeeperClientConfig) {
        this.baseUrl = gatekeeperClientConfig.baseUrl;
        this.stage = gatekeeperClientConfig.stage;
        this.queryParams = gatekeeperClientConfig.queryParams;
        this.fetchImplementation = gatekeeperClientConfig.fetchImplementation || fetch;
        // By default retry on every 5xx or other Error (e.g. network failure):
        this.defaultRetryParams = {
            retries: gatekeeperClientConfig.numRetries || (0, config_1.getDefaultApiNumRetries)(this.stage),
            retryOn: (attempt, retries, error, response) => attempt < retries && (!!error || !response || response.status >= 500),
            retryDelay: (attempt) => 2 ** attempt * 1000 * testRetryMultipler(),
        };
        this.fetchWithRetry = (0, fetch_retry_ts_1.default)(this.fetchImplementation, this.defaultRetryParams);
    }
    addQueryParams(url) {
        if (!this.queryParams)
            return;
        Object.entries(this.queryParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    urlForWallet(walletAddress) {
        const url = new URL(`${this.baseUrl}/${walletAddress}`);
        this.addQueryParams(url);
        return url.toString();
    }
    async getGatekeeperRecordWithPayload(walletAddress) {
        return this.fetchWithRetry(this.urlForWallet(walletAddress), {
            method: 'GET',
            headers: defaultHeaders,
        }).then(async (response) => ({
            state: types_1.GatekeeperRecordState[types_1.GatekeeperRecordState[response.status]],
            payload: await response.json(),
        }));
    }
    async getGatekeeperStatus(walletAddress) {
        return this.fetchWithRetry(this.urlForWallet(walletAddress), {
            method: 'HEAD',
            headers: defaultHeaders,
        }).then(({ status }) => status);
    }
    async requestGatewayTokenFromGatekeeper({ wallet, payload, proof }) {
        // produce a signature that proves ownership of a wallet
        logger_1.default.debug('requestGatewayTokenFromGatekeeper request', Object.assign(Object.assign({}, payload), { proof }));
        // We only pass the wallet public key as part of the request if
        // it was not passed as part of the presentation.
        const body = Object.assign(Object.assign({}, payload), { proof, address: wallet.publicKey });
        const gatewayTokenCreationRequest = Object.assign(Object.assign({}, body), { proof });
        logger_1.default.debug('requestGatewayTokenFromGatekeeper Requesting a new gatekeeper token...', gatewayTokenCreationRequest);
        const url = new URL(this.baseUrl);
        this.addQueryParams(url);
        return this.fetchWithRetry(url.toString(), {
            method: 'POST',
            headers: Object.assign(Object.assign({}, defaultHeaders), { 'Content-Type': 'application/json' }),
            body: JSON.stringify(gatewayTokenCreationRequest),
        }).then((resp) => resp);
    }
    /**
     * Tries to refresh a token.
     * If it fails with a 5xx, handleFetchError will retry a number of times.
     */
    async refreshToken(gatewayTokenKey, walletPublicKey, payload, proof) {
        logger_1.default.debug('refreshToken...', { gatewayTokenKey, payload });
        logger_1.default.debug('Attempting to refresh the Gateway token');
        return this.fetchWithRetry(this.urlForWallet(walletPublicKey), {
            method: 'PATCH',
            headers: Object.assign(Object.assign({}, defaultHeaders), { 'Content-Type': 'application/json' }),
            body: JSON.stringify(Object.assign({ proof, request: 'refresh' }, payload)),
        });
    }
}
exports.default = GatekeeperClient;
