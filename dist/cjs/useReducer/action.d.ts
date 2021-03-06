import { GatewayToken } from '../types';
export declare type AppAction = {
    type: 'tokenChange';
    token: GatewayToken | undefined;
} | {
    type: 'startWalletPowo';
} | {
    type: 'walletPowoComplete';
} | {
    type: 'walletPowoIncomplete';
} | {
    type: 'refreshAttemptDone';
} | {
    type: 'powoComplete';
} | {
    type: 'walletDisconnected';
} | {
    type: 'iframeClosed';
} | {
    type: 'requestGatekeeperIssuance';
} | {
    type: 'requestGatekeeperIssuanceComplete';
} | {
    type: 'requestGatekeeperIssuanceFailed';
} | {
    type: 'tokenNotFoundError';
} | {
    type: 'gatekeeperNetworkChanged';
    gatekeeperNetworkAddress: string;
} | {
    type: 'updateStateWithProps';
    walletAddress: string | undefined;
    stage: string;
    redirectUrl: string;
    gatekeeperNetworkAddress: string | undefined;
};
