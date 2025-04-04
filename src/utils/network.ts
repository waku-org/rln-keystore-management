"use client";

import { ethers } from 'ethers';

// Linea Sepolia configuration
export const LINEA_SEPOLIA_CONFIG = {
  chainId: 59141,
  tokenAddress: '0x185A0015aC462a0aECb81beCc0497b649a64B9ea'
};

// Type for Ethereum provider in window
export interface EthereumProvider {
  request: (args: { 
    method: string; 
    params?: unknown[] 
  }) => Promise<unknown>;
}

// Function to ensure the wallet is connected to Linea Sepolia network
export const ensureLineaSepoliaNetwork = async (signer?: ethers.Signer): Promise<boolean> => {
  try {
    console.log("Current network: unknown", await signer?.getChainId());
    
    // Check if already on Linea Sepolia
    if (await signer?.getChainId() === LINEA_SEPOLIA_CONFIG.chainId) {
      console.log("Already on Linea Sepolia network");
      return true;
    }
    
    // If not on Linea Sepolia, try to switch
    console.log("Not on Linea Sepolia, attempting to switch...");
    
    // Get the provider from window.ethereum
    const provider = window.ethereum as EthereumProvider | undefined;
    
    if (!provider) {
      console.warn("No Ethereum provider found");
      return false;
    }
    
    try {
      // Request network switch
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${LINEA_SEPOLIA_CONFIG.chainId.toString(16)}` }],
      });
      
      console.log("Successfully switched to Linea Sepolia");
      return true;
    } catch (switchError: unknown) {
      console.error("Error switching network:", switchError);
      return false;
    }
  } catch (err) {
    console.error("Error checking or switching network:", err);
    return false;
  }
};

// ERC20 ABI for token operations
export const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

// Message for signing to generate identity
export const SIGNATURE_MESSAGE = "Sign this message to generate your RLN credentials"; 