import { RootState, WalletAdapter } from '../types';
import type { Action } from '../useReducer';
import GatekeeperClient from '../utils/gatekeeperClient';
declare const useGatekeeper: ({ wallet, stage, gatekeeperClient, }: {
    wallet: WalletAdapter | undefined;
    stage: string;
    gatekeeperClient: () => GatekeeperClient;
}, state: Partial<RootState>, dispatch: React.Dispatch<Action>) => {
    waitForGatekeeperIssuanceRequest: (value: {
        proof?: string;
        payload?: unknown;
    }) => PromiseLike<void> | null;
    gatekeeperClient: () => GatekeeperClient;
};
export default useGatekeeper;
