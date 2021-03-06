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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGateway = exports.GatewayProvider = void 0;
const react_1 = __importStar(require("react"));
const iframe_resizer_react_1 = __importDefault(require("iframe-resizer-react"));
const types_1 = require("../types");
const logger_1 = __importDefault(require("../logger"));
const Wrapper_1 = require("../wrapper/Wrapper");
const constants_1 = require("../constants");
const config_1 = require("../config");
const config_2 = require("../solana/config");
const gatekeeperClient_1 = __importDefault(require("../utils/gatekeeperClient"));
const useReducer_1 = __importDefault(require("../useReducer"));
const useUserInteraction_1 = __importDefault(require("../useHooks/useUserInteraction"));
const useOrchestration_1 = __importDefault(require("../useHooks/useOrchestration"));
const useWalletHooks_1 = __importDefault(require("../useHooks/useWalletHooks"));
const GatewayContext = react_1.default.createContext({
    requestGatewayToken: async () => { },
    gatewayStatus: types_1.GatewayStatus.NOT_REQUESTED,
    stage: config_1.DEFAULT_GATEKEEPER_STAGE,
});
const redirectUrlFromWindow = () => encodeURIComponent(window.location.href.split('?')[0]);
const GatewayProvider = ({ children = null, wallet, chainImplementation, wrapper, logo, stage = 'prod', redirectUrl, gatekeeperNetwork, options = { autoShowModal: true }, }) => {
    const gatekeeperNetworkAddress = gatekeeperNetwork;
    const [state, dispatch] = (0, react_1.useReducer)(useReducer_1.default, {
        options,
        gatewayStatus: types_1.GatewayStatus.UNKNOWN,
        tokenRequested: false,
        iframeMinimized: false,
        firstTokenCheck: true,
        renderIframe: false,
        powoFinished: false,
        refreshInProgress: false,
        walletPowoInProgress: false,
        walletAddress: wallet === null || wallet === void 0 ? void 0 : wallet.publicKey,
        iframeSrcUrl: undefined,
        stage,
        redirectUrl: redirectUrl || redirectUrlFromWindow(),
        tokenIssuanceState: types_1.TokenIssuanceState.NOT_REQUESTED,
        refreshTokenState: types_1.RefreshTokenState.NOT_REQUIRED,
        civicPass: {
            status: types_1.CivicPassIssuanceStatus.NOT_REQUESTED,
            iframeMinimized: false,
            renderIframe: false,
        },
        gatekeeperNetworkAddress,
        chainType: chainImplementation.chainType,
    });
    const { gatewayStatus, iframeMinimized, renderIframe, gatewayToken, iframeSrcUrl } = state;
    (0, useWalletHooks_1.default)(wallet, state, dispatch); // need to handle wallet connect and disconnect first
    // ensure the state is updated with any changes to input props
    (0, react_1.useEffect)(() => {
        dispatch({
            type: 'updateStateWithProps',
            redirectUrl: redirectUrl || redirectUrlFromWindow(),
            stage,
            walletAddress: wallet === null || wallet === void 0 ? void 0 : wallet.publicKey,
            gatekeeperNetworkAddress,
        });
    }, [redirectUrl, stage, wallet, gatekeeperNetworkAddress]);
    const clusterName = chainImplementation.httpConfig.queryParams.network;
    const gatekeeperEndpoint = (0, config_2.getGatekeeperEndpoint)(stage);
    const gatekeeperClient = (0, react_1.useCallback)(() => {
        if (!gatekeeperNetworkAddress) {
            throw new Error('No gatekeeper network passed in.');
        }
        return new gatekeeperClient_1.default({
            baseUrl: gatekeeperEndpoint,
            stage,
            queryParams: { network: clusterName, gatekeeperNetworkAddress },
        });
    }, [stage, gatekeeperEndpoint, gatekeeperNetworkAddress, clusterName]);
    // this hook implements the main business logic and handles requesting and refreshing gateway tokens
    (0, useOrchestration_1.default)({ wallet, chainImplementation, stage, gatekeeperClient }, state, dispatch);
    // requestGatewayToken is the only user-triggered event handled by the component
    // the compliance iframe user interaction is handled using events triggered from the iframe
    const { requestGatewayToken } = (0, useUserInteraction_1.default)({ wallet }, state, dispatch);
    const civicPassSrcUrl = (0, config_1.getCivicPassEndpoint)(stage);
    /**
     * manage local state for display of the close button ui relative to iframe loading
     */
    const [iframeLoaded, setIframeLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        logger_1.default.info('GatewayContext gatewayStatus', types_1.GatewayStatus[gatewayStatus]);
    }, [gatewayStatus]);
    /**
     * Reset the iFrame when removing the iFrame from the DOM
     */
    (0, react_1.useEffect)(() => {
        if (!renderIframe) {
            setIframeLoaded(false);
        }
    }, [renderIframe]);
    return (react_1.default.createElement(GatewayContext.Provider, { value: {
            requestGatewayToken,
            gatewayStatus,
            gatewayToken: gatewayStatus === types_1.GatewayStatus.ACTIVE ? gatewayToken : undefined,
            stage,
            civicPassSrcUrl,
        } },
        children,
        renderIframe && (react_1.default.createElement("div", { "data-testid": constants_1.TESTID_WRAPPER_CONTAINER, hidden: iframeMinimized },
            react_1.default.createElement(Wrapper_1.Wrapper, { "data-testid": constants_1.TESTID_WRAPPER, onClose: () => dispatch({ type: 'civicPass_close' }), wrapper: wrapper, logo: logo, loaded: iframeLoaded },
                react_1.default.createElement(iframe_resizer_react_1.default, { "data-testid": constants_1.TESTID_IFRAME, src: iframeSrcUrl, id: constants_1.IFRAME_ID, style: {
                        width: '1px',
                        minWidth: '100%',
                        border: 'none',
                        height: '26px',
                        transition: 'height 0.25s ease',
                    }, heightCalculationMethod: "min", checkOrigin: false, onLoad: () => setIframeLoaded(true), inPageLinks: true, allow: "camera", allowFullScreen: true, frameBorder: "0" }))))));
};
exports.GatewayProvider = GatewayProvider;
const useGateway = () => (0, react_1.useContext)(GatewayContext);
exports.useGateway = useGateway;
