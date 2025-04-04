"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { KeystoreEntity, RLNCredentialsManager } from '@waku/rln';
import { createRLNImplementation } from './implementations';
import { useRLNImplementation } from './RLNImplementationContext';
import { ethers } from 'ethers';
import { useKeystore } from '../keystore';
import { ERC20_ABI, LINEA_SEPOLIA_CONFIG, ensureLineaSepoliaNetwork } from '../../utils/network';

interface RLNContextType {
  rln: RLNCredentialsManager | null;
  isInitialized: boolean;
  isStarted: boolean;
  error: string | null;
  initializeRLN: () => Promise<void>;
  registerMembership: (rateLimit: number, saveOptions?: { password: string }) => Promise<{ 
    success: boolean; 
    error?: string; 
    credentials?: KeystoreEntity;
    keystoreHash?: string;
  }>;
  rateMinLimit: number;
  rateMaxLimit: number;
  getCurrentRateLimit: () => Promise<number | null>;
  getRateLimitsBounds: () => Promise<{ success: boolean; rateMinLimit: number; rateMaxLimit: number; error?: string }>;
  saveCredentialsToKeystore: (credentials: KeystoreEntity, password: string) => Promise<string>;
  isLoading: boolean;
}

const RLNContext = createContext<RLNContextType | undefined>(undefined);

export function RLNProvider({ children }: { children: ReactNode }) {
  const { implementation } = useRLNImplementation();
  const [rln, setRln] = useState<RLNCredentialsManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the signer from window.ethereum
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rateMinLimit, setRateMinLimit] = useState<number>(0);
  const [rateMaxLimit, setRateMaxLimit] = useState<number>(0);

  const { saveCredentials: saveToKeystore } = useKeystore();
  
  // Listen for wallet connection
  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            setSigner(signer);
            setIsConnected(true);
            return;
          }
        }
        
        setSigner(null);
        setIsConnected(false);
      } catch (err) {
        console.error("Error checking wallet:", err);
        setSigner(null);
        setIsConnected(false);
      }
    };
    
    checkWallet();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkWallet);
      window.ethereum.on('chainChanged', checkWallet);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkWallet);
        window.ethereum.removeListener('chainChanged', checkWallet);
      }
    };
  }, []);
  
  // Reset RLN state when implementation changes
  useEffect(() => {
    setRln(null);
    setIsInitialized(false);
    setIsStarted(false);
    setError(null);
  }, [implementation]);
  
  const initializeRLN = useCallback(async () => {
    console.log("InitializeRLN called. Connected:", isConnected, "Signer available:", !!signer);
    
    try {
      setError(null);
      setIsLoading(true);
      
      if (!rln) {
        console.log(`Creating RLN ${implementation} instance...`);
        
        try {
          const rlnInstance = await createRLNImplementation(implementation);
          
          console.log("RLN instance created successfully:", !!rlnInstance);
          setRln(rlnInstance);
          
          setIsInitialized(true);
          console.log("isInitialized set to true");
        } catch (createErr) {
          console.error("Error creating RLN instance:", createErr);
          throw createErr;
        }
      } else {
        console.log("RLN instance already exists, skipping creation");
      }
      
      if (isConnected && signer && rln && !isStarted) {
        console.log("Starting RLN with signer...");
        try {          
          await rln.start({ signer });
          
          setIsStarted(true);
          console.log("RLN started successfully, isStarted set to true");

          try {
            const minLimit = await rln.contract?.getMinRateLimit();
            const maxLimit = await rln.contract?.getMaxRateLimit();
            if (minLimit !== undefined && maxLimit !== undefined) {
              setRateMinLimit(minLimit);
              setRateMaxLimit(maxLimit);
              console.log("Rate limits fetched:", { min: minLimit, max: maxLimit });
            } else {
              throw new Error("Rate limits not available");
            }
          } catch (limitErr) {
            console.warn("Could not fetch rate limits:", limitErr);
          }
        } catch (startErr) {
          console.error("Error starting RLN:", startErr);
          throw startErr;
        }
      } else {
        console.log("Skipping RLN start because:", {
          isConnected,
          hasSigner: !!signer,
          hasRln: !!rln,
          isAlreadyStarted: isStarted
        });
      }
    } catch (err) {
      console.error('Error in initializeRLN:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize RLN');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, signer, implementation, rln, isStarted]);

  // Auto-initialize effect for Light implementation
  useEffect(() => {
    if (implementation === 'light' && isConnected && signer && !isInitialized && !isStarted && !isLoading) {
      console.log('Auto-initializing Light RLN implementation...');
      initializeRLN();
    }
  }, [implementation, isConnected, signer, isInitialized, isStarted, isLoading, initializeRLN]);

  const getCurrentRateLimit = async (): Promise<number | null> => {
    try {
      if (!rln || !rln.contract || !isStarted) {
        console.log("Cannot get rate limit: RLN not initialized or started");
        return null;
      }
      
      const rateLimit = rln.contract.getRateLimit();
      console.log("Current rate limit:", rateLimit);
      return rateLimit;
    } catch (err) {
      console.error("Error getting current rate limit:", err);
      return null;
    }
  };

  const getRateLimitsBounds = async () => {
    try {
      if (!rln || !isStarted) {
        return { 
          success: false, 
          rateMinLimit: 0, 
          rateMaxLimit: 0, 
          error: 'RLN not initialized or not started' 
        };
      }
      const minLimit = await rln.contract?.getMinRateLimit();
      const maxLimit = await rln.contract?.getMaxRateLimit();
      if (minLimit !== undefined && maxLimit !== undefined) {
      // Update state
      setRateMinLimit(minLimit);
      setRateMaxLimit(maxLimit);
      } else {
        throw new Error("Rate limits not available");
      }
      
      return {
        success: true,
        rateMinLimit: minLimit,
        rateMaxLimit: maxLimit
      };
    } catch (err) {
      return { 
        success: false, 
        rateMinLimit: rateMinLimit, 
        rateMaxLimit: rateMaxLimit, 
        error: err instanceof Error ? err.message : 'Failed to get rate limits' 
      };
    }
  };

  const saveCredentialsToKeystore = async (credentials: KeystoreEntity, password: string): Promise<string> => {
    try {
      return await saveToKeystore(credentials, password);
    } catch (err) {
      console.error("Error saving credentials to keystore:", err);
      throw err;
    }
  };

  const registerMembership = async (rateLimit: number, saveOptions?: { password: string }) => {
    console.log("registerMembership called with rate limit:", rateLimit);
    
    if (!rln || !isStarted) {
      return { success: false, error: 'RLN not initialized or not started' };
    }
    
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }
    
    try {
      // Validate rate limit
      if (rateLimit < rateMinLimit || rateLimit > rateMaxLimit) {
        return { 
          success: false, 
          error: `Rate limit must be between ${rateMinLimit} and ${rateMaxLimit}` 
        };
      }
      await rln.contract?.setRateLimit(rateLimit);
      
      // Ensure we're on the correct network
      const isOnLineaSepolia = await ensureLineaSepoliaNetwork(signer);
      if (!isOnLineaSepolia) {
        console.warn("Could not switch to Linea Sepolia network. Registration may fail.");
      }
      
      // Get user address and contract address
      const userAddress = await signer.getAddress();
      
      if (!rln.contract || !rln.contract.address) {
        return { success: false, error: "RLN contract address not available. Cannot proceed with registration." };
      }
      
      const contractAddress = rln.contract.address;
      const tokenAddress = LINEA_SEPOLIA_CONFIG.tokenAddress;
      
      // Create token contract instance
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      );
      
      // Check token balance
      const tokenBalance = await tokenContract.balanceOf(userAddress);
      if (tokenBalance.isZero()) {
        return { success: false, error: "You need tokens to register a membership. Your token balance is zero." };
      }
      
      // Check and approve token allowance if needed
      const currentAllowance = await tokenContract.allowance(userAddress, contractAddress);
      if (currentAllowance.eq(0)) {
        console.log("Requesting token approval...");
        
        // Approve a large amount (max uint256)
        const maxUint256 = ethers.constants.MaxUint256;
        
        try {
          const approveTx = await tokenContract.approve(contractAddress, maxUint256);
          console.log("Approval transaction submitted:", approveTx.hash);
          
          // Wait for the transaction to be mined
          await approveTx.wait(1);
          console.log("Token approval confirmed");
        } catch (approvalErr) {
          console.error("Error during token approval:", approvalErr);
          return { 
            success: false, 
            error: `Failed to approve token: ${approvalErr instanceof Error ? approvalErr.message : String(approvalErr)}` 
          };
        }
      } else {
        console.log("Token allowance already sufficient");
      }
      
      // Generate signature for identity
      const timestamp = Date.now();
      const message = `Sign this message to generate your RLN credentials ${timestamp}`;
      const signature = await signer.signMessage(message);
      
      // Register membership
      console.log("Registering membership...");
      const credentials = await rln.registerMembership({
        signature: signature
      });
      console.log("Credentials:", credentials);
      
      // If we have save options, save to keystore
      let keystoreHash: string | undefined;
      if (saveOptions && saveOptions.password && credentials) {
        try {
          const credentialsEntity = credentials as KeystoreEntity;
          keystoreHash = await saveCredentialsToKeystore(credentialsEntity, saveOptions.password);
          console.log("Credentials saved to keystore with hash:", keystoreHash);
        } catch (saveErr) {
          console.error("Error saving credentials to keystore:", saveErr);
          // Continue without failing the overall registration
        }
      }
      
      return { 
        success: true, 
        credentials: credentials as KeystoreEntity, 
        keystoreHash 
      };
    } catch (err) {
      console.error("Error registering membership:", err);
      
      let errorMsg = "Failed to register membership";
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      
      return { success: false, error: errorMsg };
    }
  };

  return (
    <RLNContext.Provider
      value={{
        rln,
        isInitialized,
        isStarted,
        error,
        initializeRLN,
        registerMembership,
        rateMinLimit,
        rateMaxLimit,
        getCurrentRateLimit,
        getRateLimitsBounds,
        saveCredentialsToKeystore: saveToKeystore,
        isLoading
      }}
    >
      {children}
    </RLNContext.Provider>
  );
}

export function useRLN() {
  const context = useContext(RLNContext);
  if (context === undefined) {
    throw new Error('useRLN must be used within a RLNProvider');
  }
  return context;
} 