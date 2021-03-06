/// <reference types="react" />
export declare enum State {
    ACTIVE = "ACTIVE",
    REVOKED = "REVOKED",
    FROZEN = "FROZEN"
}
export declare type GatewayToken = {
    readonly issuingGatekeeper: string;
    readonly gatekeeperNetworkAddress: string;
    readonly owner: string;
    readonly state: State;
    readonly identifier: string;
    readonly expiryTime?: number;
};
export declare enum TokenState {
    REQUESTED = "REQUESTED",
    ACTIVE = "ACTIVE",
    REVOKED = "REVOKED",
    FROZEN = "FROZEN",
    REJECTED = "REJECTED"
}
export declare type GatekeeperRecord = {
    walletAddress: string;
    token?: string;
    state: TokenState;
    expiryTimestamp?: number;
    issueTimestamp?: number;
};
export declare enum GatekeeperRecordState {
    REQUESTING = 0,
    NOT_REQUESTED = 404,
    REQUESTED = 202,
    ISSUED = 200,
    ISSUED_EXPIRY_APPROACHING = 205,
    ISSUED_EXPIRED = 426,
    LOCATION_NOT_SUPPORTED = 401,
    ISSUED_LOCATION_NOT_SUPPORTED = 412,
    SERVER_FAILURE = 500
}
export declare enum GatewayStatus {
    UNKNOWN = 0,
    CHECKING = 1,
    NOT_REQUESTED = 2,
    COLLECTING_USER_INFORMATION = 3,
    PROOF_OF_WALLET_OWNERSHIP = 4,
    IN_REVIEW = 5,
    REJECTED = 6,
    REVOKED = 7,
    FROZEN = 8,
    ACTIVE = 9,
    ERROR = 10,
    LOCATION_NOT_SUPPORTED = 11,
    REFRESH_TOKEN_REQUIRED = 12,
    VALIDATING_USER_INFORMATION = 13,
    USER_INFORMATION_VALIDATED = 14,
    USER_INFORMATION_REJECTED = 15
}
export interface WalletAdapter {
    publicKey: string;
}
/**
 * The properties that the component exposes to the user through useGateway
 */
export declare type GatewayProps = {
    requestGatewayToken: () => Promise<void>;
    gatewayStatus: GatewayStatus;
    gatewayToken?: GatewayToken;
    stage?: string;
    clusterUrl?: string;
    civicPassSrcUrl?: string;
};
/**
 * The properties object passed by the dApp when defining the component
 */
export declare type GatewayProviderProps = {
    wallet: WalletAdapter | undefined;
    gatekeeperNetwork: string | undefined;
    chainImplementation: Chain;
    stage?: string;
    wrapper?: React.FC;
    logo?: string;
    redirectUrl?: string;
    options?: Options;
};
export declare type CreateTokenRequest = {
    wallet: WalletAdapter;
    payload?: unknown;
    proof?: string;
};
export declare enum TokenIssuanceState {
    NOT_REQUESTED = 0,
    IN_PROGRESS = 1,
    COMPLETED = 2,
    FAILED = 3
}
export declare enum CivicPassIssuanceStatus {
    NOT_REQUESTED = 0,
    REQUESTED = 1,
    VERIFIED = 2,
    FAILED = 3
}
export declare enum RefreshTokenState {
    NOT_REQUIRED = 0,
    CHECK_TOKEN_EXPIRATION = 1,
    WAIT_FOR_ON_CHAIN = 2,
    IN_PROGRESS = 3,
    REQUIRES_POWO = 4,
    COMPLETED = 5,
    CANCELLED = 6,
    FAILED = 7
}
export declare type Options = {
    autoShowModal: boolean;
};
export declare type RootState = {
    options: Options;
    gatewayStatus: GatewayStatus;
    gatekeeperRecordState?: GatekeeperRecordState;
    tokenRequested: boolean;
    iframeMinimized: boolean;
    firstTokenCheck: boolean;
    renderIframe: boolean;
    powoFinished: boolean;
    gatewayToken?: GatewayToken;
    powoRequested?: string;
    walletPowoInProgress: boolean;
    refreshIntervalId?: number;
    walletToRefresh?: WalletAdapter;
    refreshInProgress: boolean;
    tokenIssuanceState: TokenIssuanceState;
    refreshTokenState: RefreshTokenState;
    iframeSrcUrl?: string;
    stage: string;
    redirectUrl: string;
    walletAddress?: string;
    civicPass: CivicPassState;
    gatekeeperNetworkAddress?: string;
    chainType: ChainType;
};
export declare type CivicPassState = {
    status: CivicPassIssuanceStatus;
    requestPayload?: unknown;
    responsePayload?: {
        [CivicPassMessageAction: string]: {
            requiresProofOfWalletOwnership: boolean;
            payload: unknown;
        };
    };
    iframeSrcUrl?: string;
    iframeMinimized: boolean;
    renderIframe: boolean;
};
export declare type ChainHttpConfig = {
    baseUrl: string;
    queryParams: Record<string, string>;
};
export declare enum ChainType {
    SOLANA = "solana",
    ETHEREUM = "ethereum",
    CASPER = "casper"
}
export interface Chain {
    addOnGatewayTokenChangeListener: (gatewayToken: GatewayToken, tokenDidChange: (GatewayToken: GatewayToken) => void) => number;
    removeOnGatewayTokenChangeListener: (listenerId: number) => void;
    findGatewayToken: () => Promise<GatewayToken | undefined>;
    proveWalletOwnership: () => Promise<string>;
    httpConfig: ChainHttpConfig;
    chainType: ChainType;
}
export declare enum CivicPassMessageEventResult {
    SUCCESS = "success",
    FAILURE = "failure",
    CANCELLED = "cancelled",
    IN_PROGRESS = "inProgress"
}
export declare enum CivicPassMessageAction {
    ISSUANCE = "issuance",
    CONFIRM_TRANSACTION = "confirmTransaction",
    TOKEN_FROZEN = "tokenFrozen",
    TOKEN_ACTIVE = "tokenActive",
    TOKEN_REVOKED = "tokenRevoked",
    TOKEN_REJECTED = "tokenRejected",
    TOKEN_IN_REVIEW = "tokenInReview",
    FAILED_IP_CHECK = "failedIpCheck",
    REFRESH = "refresh",
    PROOF_OF_WALLET_OWNERSHIP = "proofOfWalletOwnership",
    STATUS = "status"
}
export interface CivicPassMessageResponse {
    event: CivicPassMessageEventResult;
    action: CivicPassMessageAction;
    requiresProofOfWalletOwnership: boolean;
    payload?: unknown;
}
export declare type CivicPassMessageResponsePayload = {
    status: ValidationStatus;
};
export interface CivicPassMessageRequest {
    action: CivicPassMessageAction;
    networkAddress: string;
    payload?: string;
}
export interface CivicPassMessageEventResponse extends MessageEvent {
    data: CivicPassMessageResponse;
}
export declare enum ValidationStatus {
    COLLECTING = "COLLECTING",
    PROCESSING = "PROCESSING",
    IN_REVIEW = "IN_REVIEW",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    NOT_FOUND = "NOT_FOUND"
}
