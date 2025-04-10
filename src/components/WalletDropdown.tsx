"use client";

import React, { useState, ChangeEvent } from 'react';
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
import { ChevronDown, PlusCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function WalletDropdown() {
  const { isConnected, address, chainId, connectWallet, disconnectWallet, balance, wttBalance, mintWTT } = useWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mintAmount, setMintAmount] = useState('1000');

  const handleMint = async () => {
    await mintWTT(Number(mintAmount));
    setIsDialogOpen(false);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMintAmount(e.target.value);
  };

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
    <>
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
        <DropdownMenuContent align="end" className="w-64 font-mono border-terminal-border bg-terminal-background/95">
          <DropdownMenuLabel className="border-b border-terminal-border text-primary">Wallet</DropdownMenuLabel>
          
          <div className="p-2 space-y-2">
            {/* Address */}
            <div className="grid grid-cols-12 gap-1 text-xs">
              <span className="text-muted-foreground col-span-3">Address:</span> 
              <span className="text-primary col-span-9 truncate">{address}</span>
            </div>
            
            {/* Network */}
            <div className="grid grid-cols-12 gap-1 text-xs">
              <span className="text-muted-foreground col-span-3">Network:</span> 
              <span className="text-green-400 col-span-9">{chainId === 59141 ? "Linea Sepolia" : `Unknown (${chainId})`}</span>
            </div>
            
            {/* ETH Balance */}
            {balance && (
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="text-muted-foreground col-span-3">Balance:</span> 
                <span className="text-primary col-span-9">{parseFloat(balance).toFixed(4)} ETH</span>
              </div>
            )}
            
            {/* WTT Balance with Mint Button */}
            {wttBalance && (
              <div className="text-xs">
                <div className="grid grid-cols-12 gap-1 mb-1">
                  <span className="text-muted-foreground col-span-3">WTT</span> 
                  <span className="text-primary col-span-9">{parseFloat(wttBalance).toFixed(4)}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="text-muted-foreground col-span-3">Balance:</span>
                  <span className="text-green-400 col-span-7">WTT</span>
                  <div className="col-span-2 text-right">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-primary hover:text-green-400">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-terminal-background border-terminal-border">
                        <DialogHeader>
                          <DialogTitle className="text-primary">Mint WTT Tokens</DialogTitle>
                          <DialogDescription>
                            Enter the amount of WTT tokens you want to mint.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              value={mintAmount}
                              onChange={handleAmountChange}
                              className="col-span-3 bg-terminal-background border-terminal-border text-primary"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="terminal" 
                            onClick={handleMint}
                            className="text-xs"
                          >
                            Mint Tokens
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DropdownMenuSeparator className="bg-terminal-border" />
          <DropdownMenuItem 
            onClick={disconnectWallet}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
} 