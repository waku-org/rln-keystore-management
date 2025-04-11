import { ethers } from 'ethers';

export interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    signer: ethers.Signer | null;
    balance: string | null;
    wttBalance: string | null;
    chainId: number | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    mintWTT: (amount: number) => Promise<void>;
    error: string | null;
  }

  declare global {
    interface Window {
      ethereum?: {
        isMetaMask?: boolean;
        isConnected?: boolean;
        selectedAddress?: string;
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        on(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
        on(event: 'chainChanged', listener: (chainId: string) => void): void;
        on(event: string, listener: (...args: unknown[]) => void): void;
        removeListener(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
        removeListener(event: 'chainChanged', listener: (chainId: string) => void): void;
        removeListener(event: string, listener: (...args: unknown[]) => void): void;
      };
    }
  } 