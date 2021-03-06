"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSolanaGateway = exports.SolanaGatewayProvider = void 0;
const react_1 = __importStar(require("react"));
const GatewayContext_1 = require("../gateway/GatewayContext");
const chainImplementation_1 = require("./chainImplementation");
const logger_1 = __importDefault(require("../logger"));
// eslint-disable-next-line import/prefer-default-export
const SolanaGatewayProvider = ({ children = null, wallet, clusterUrl = 'https://civic.rpcpool.com/f40a068020b85335d0c8f2783747', gatekeeperNetwork, wrapper, logo, stage = 'prod', redirectUrl, options = { autoShowModal: true }, }) => {
    var _a, _b;
    const chainImpl = (0, react_1.useMemo)(() => {
        if ((wallet === null || wallet === void 0 ? void 0 : wallet.publicKey) && gatekeeperNetwork) {
            const { publicKey, signTransaction } = wallet;
            return (0, chainImplementation_1.chainImplementation)({
                clusterUrl,
                publicKey,
                signTransaction,
                gatekeeperNetworkAddress: gatekeeperNetwork,
                stage,
            });
        }
        return undefined;
    }, [clusterUrl, (_a = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey) === null || _a === void 0 ? void 0 : _a.toBase58(), gatekeeperNetwork === null || gatekeeperNetwork === void 0 ? void 0 : gatekeeperNetwork.toBase58(), stage]);
    const walletAdapter = (0, react_1.useMemo)(() => {
        if (wallet === null || wallet === void 0 ? void 0 : wallet.publicKey) {
            const { publicKey } = wallet;
            return { publicKey: publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58() };
        }
        return undefined;
    }, [(_b = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey) === null || _b === void 0 ? void 0 : _b.toBase58()]);
    if (walletAdapter && chainImpl) {
        logger_1.default.info('Client Options', options);
        return (react_1.default.createElement(GatewayContext_1.GatewayProvider, { wallet: walletAdapter, stage: stage, chainImplementation: chainImpl, gatekeeperNetwork: gatekeeperNetwork === null || gatekeeperNetwork === void 0 ? void 0 : gatekeeperNetwork.toBase58(), wrapper: wrapper, logo: logo, redirectUrl: redirectUrl, options: options }, children));
    }
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
exports.SolanaGatewayProvider = SolanaGatewayProvider;
var chainImplementation_2 = require("./chainImplementation");
Object.defineProperty(exports, "useSolanaGateway", { enumerable: true, get: function () { return chainImplementation_2.useSolanaGateway; } });
__exportStar(require("./types"), exports);
