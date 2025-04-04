"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { createRLN,  LINEA_CONTRACT, RLNInstance } from '@waku/rln';
import { ethers } from 'ethers';
import { ensureLineaSepoliaNetwork, ERC20_ABI, SIGNATURE_MESSAGE } from '../../../utils/network';
import { RLNContextType } from './types';
import { useWallet } from '@/contexts';



const RLNContext = createContext<RLNContextType | undefined>(undefined);

export function RLNProvider({ children }: { children: ReactNode }) {
  const { isConnected, signer } = useWallet();
  const [rln, setRln] = useState<RLNInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateMinLimit, setRateMinLimit] = useState(0);
  const [rateMaxLimit, setRateMaxLimit] = useState(0);

  const initializeRLN = async () => {
    console.log("InitializeRLN called. Connected:", isConnected, "Signer available:", !!signer);
    
    try {
      setError(null);
      
      if (!rln) {
        console.log("Creating RLN instance...");
        
        try {
          const rlnInstance = await createRLN();
          
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

            const minRate = await rln.contract?.getMinRateLimit();
            const maxRate = await rln.contract?.getMaxRateLimit();
            setRateMinLimit(minRate || 0);
            setRateMaxLimit(maxRate || 0);
            console.log("Min rate:", minRate);
            console.log("Max rate:", maxRate);
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
    }
  };

  const registerMembership = async (rateLimit: number) => {
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
      rln.contract?.setRateLimit(rateLimit);
      
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
      const tokenAddress = LINEA_CONTRACT.address;
      
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
      const message = `${SIGNATURE_MESSAGE} ${Date.now()}`;
      const signature = await signer.signMessage(message);

      const _credentials = await rln.registerMembership({signature: signature});      
      if (!_credentials) {
        throw new Error("Failed to register membership: No credentials returned");
      }
      if (!_credentials.identity) {
        throw new Error("Failed to register membership: Missing identity information");
      }
      if (!_credentials.membership) {
        throw new Error("Failed to register membership: Missing membership information");
      }
      
      return { success: true, credentials: _credentials };
    } catch (err) {      
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
        rateMaxLimit
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