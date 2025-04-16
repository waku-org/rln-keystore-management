import { DecryptedCredentials, RLNCredentialsManager, RLNInstance } from "@waku/rln";

export interface RLNContextType {
    rln: RLNInstance | RLNCredentialsManager | null;
    isInitialized: boolean;
    isStarted: boolean;
    error: string | null;
    initializeRLN: () => Promise<void>;
    registerMembership: (rateLimit: number) => Promise<{ success: boolean; error?: string; credentials?: DecryptedCredentials }>;
    rateMinLimit: number;
    rateMaxLimit: number;
  }