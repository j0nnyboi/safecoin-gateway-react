import { RootState, WalletAdapter, Chain } from '../types';
import type { Action } from '../useReducer';
declare const usePowo: ({ wallet, chainImplementation }: {
    wallet: WalletAdapter | undefined;
    chainImplementation: Chain;
}, state: Partial<RootState>, dispatch: React.Dispatch<Action>) => {
    waitForConfirmPOWO: (payload: unknown) => Promise<unknown>;
    waitForPOWO: (payload: unknown) => Promise<{
        proof?: string | undefined;
        payload?: unknown;
    }>;
};
export default usePowo;
