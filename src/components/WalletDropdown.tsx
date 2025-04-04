"use client";

import React from 'react';
import { useWallet } from '../contexts/wallet';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { ChevronDown } from 'lucide-react';

export function WalletDropdown() {
  const { isConnected, address, chainId, connectWallet, disconnectWallet, balance } = useWallet();

  if (!isConnected || !address) {
    return (
      <Button 
        onClick={connectWallet}
        variant="terminal"
        size="sm"
        className="text-xs"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="font-mono text-xs border-terminal-border hover:border-primary hover:text-primary"
        >
          <span 
            className={`inline-block h-2 w-2 rounded-full mr-1.5 bg-success-DEFAULT`}
          />
          <span className="cursor-blink">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuItem className="text-xs flex justify-between">
          <span className="text-muted-foreground">Address:</span> 
          <span className="text-primary truncate ml-2">{address}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs flex justify-between">
          <span className="text-muted-foreground">Network:</span> 
          <span className="text-primary ml-2">{chainId === 59141 ? "Linea Sepolia" : `Unknown (${chainId})`}</span>
        </DropdownMenuItem>
        {balance && (
          <DropdownMenuItem className="text-xs flex justify-between">
            <span className="text-muted-foreground">Balance:</span> 
            <span className="text-primary ml-2">{parseFloat(balance).toFixed(4)} ETH</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 