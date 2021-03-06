"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSolanaGateway = exports.chainImplementation = void 0;
const solana_gateway_ts_1 = require("@identity.com/solana-gateway-ts");
const web3_js_1 = require("@solana/web3.js");
const prove_solana_wallet_1 = require("@identity.com/prove-solana-wallet");
const config_1 = require("./config");
const types_1 = require("../types");
const GatewayContext_1 = require("../gateway/GatewayContext");
const logger_1 = __importDefault(require("../logger"));
// eslint-disable-next-line import/prefer-default-export
const chainImplementation = ({ clusterUrl, publicKey, signTransaction, gatekeeperNetworkAddress, stage, }) => {
    logger_1.default.debug('Connecting to cluster with commitment recent', clusterUrl);
    const connection = new web3_js_1.Connection(clusterUrl, 'processed');
    return {
        addOnGatewayTokenChangeListener: (gatewayToken, tokenDidChange) => {
            return (0, solana_gateway_ts_1.onGatewayTokenChange)(connection, new web3_js_1.PublicKey(gatewayToken.identifier), (token) => {
                tokenDidChange({
                    issuingGatekeeper: token.issuingGatekeeper.toBase58(),
                    gatekeeperNetworkAddress: token.gatekeeperNetwork.toBase58(),
                    owner: token.owner.toBase58(),
                    state: types_1.State[token.state],
                    identifier: token.publicKey.toBase58(),
                    expiryTime: token.expiryTime,
                });
            });
        },
        removeOnGatewayTokenChangeListener: (listenerId) => {
            (0, solana_gateway_ts_1.removeAccountChangeListener)(connection, listenerId);
        },
        findGatewayToken: async () => {
            const onChainToken = await (0, solana_gateway_ts_1.findGatewayToken)(connection, publicKey, new web3_js_1.PublicKey(gatekeeperNetworkAddress));
            if (!onChainToken)
                return undefined;
            return {
                issuingGatekeeper: onChainToken.issuingGatekeeper.toBase58(),
                gatekeeperNetworkAddress: onChainToken.gatekeeperNetwork.toBase58(),
                owner: onChainToken.owner.toBase58(),
                state: types_1.State[onChainToken.state],
                identifier: onChainToken.publicKey.toBase58(),
                expiryTime: onChainToken.expiryTime,
            };
        },
        proveWalletOwnership: async () => {
            const result = await (0, prove_solana_wallet_1.prove)(publicKey, signTransaction, (0, config_1.makeConfig)(clusterUrl));
            return result.toString('base64');
        },
        chainType: types_1.ChainType.SOLANA,
        httpConfig: {
            baseUrl: (0, config_1.getGatekeeperEndpoint)(stage),
            queryParams: { network: (0, config_1.urlToCluster)(clusterUrl) },
        },
    };
};
exports.chainImplementation = chainImplementation;
const useSolanaGateway = () => {
    const { gatewayToken } = (0, GatewayContext_1.useGateway)();
    const solanaGatewayToken = gatewayToken
        ? {
            issuingGatekeeper: new web3_js_1.PublicKey(gatewayToken.issuingGatekeeper),
            gatekeeperNetworkAddress: new web3_js_1.PublicKey(gatewayToken.gatekeeperNetworkAddress),
            owner: new web3_js_1.PublicKey(gatewayToken.owner),
            state: gatewayToken.state,
            publicKey: new web3_js_1.PublicKey(gatewayToken.identifier),
            expiryTime: gatewayToken.expiryTime,
        }
        : undefined;
    return Object.assign(Object.assign({}, (0, GatewayContext_1.useGateway)()), { gatewayToken: solanaGatewayToken });
};
exports.useSolanaGateway = useSolanaGateway;
