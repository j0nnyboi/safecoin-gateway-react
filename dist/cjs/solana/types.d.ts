/// <reference types="react" />
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { State, GatewayProps, Options } from '../types';
export type { Options } from '../types';
export interface ConnectionContextValues {
    endpoint: string;
    connection: Connection;
}
export interface SolanaWalletAdapter {
    publicKey?: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
}
/**
 * The properties object passed by the dApp when defining the component
 */
export declare type SolanaGatewayProviderProps = {
    wallet?: SolanaWalletAdapter;
    gatekeeperNetwork?: PublicKey;
    stage?: string;
    clusterUrl?: string;
    wrapper?: React.FC;
    logo?: string;
    redirectUrl?: string;
    options?: Options;
};
export declare type SolanaGatewayToken = {
    readonly issuingGatekeeper: PublicKey;
    readonly gatekeeperNetworkAddress: PublicKey;
    readonly owner: PublicKey;
    readonly state: State;
    readonly publicKey: PublicKey;
    readonly expiryTime?: number;
};
export declare type SolanaGatewayProps = Omit<GatewayProps, 'gatewayToken'> & {
    gatewayToken?: SolanaGatewayToken;
};
