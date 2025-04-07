import React from 'react';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { ethers } from 'ethers';
import { MembershipState } from '@waku/rln';

interface MembershipDetailsProps {
  membershipInfo: {
    address: string;
    chainId: string;
    treeIndex: number;
    rateLimit: number;
    idCommitment: string;
    startBlock: number;
    endBlock: number;
    state: MembershipState;
    depositAmount: ethers.BigNumber;
    activeDuration: number;
    gracePeriodDuration: number;
    holder: string;
    token: string;
  };
  copyToClipboard: (text: string) => void;
}

export function MembershipDetails({ membershipInfo, copyToClipboard }: MembershipDetailsProps) {
  return (
    <div className="mt-3 space-y-2 border-t border-terminal-border/40 pt-3 animate-in fade-in-50 duration-300">
      <div className="flex items-center mb-2">
        <span className="text-primary font-mono font-medium mr-2">{">"}</span>
        <h3 className="text-sm font-mono font-semibold text-primary">
          Membership Details
        </h3>
      </div>
      <div className="space-y-2 text-xs font-mono">
        <div className="grid grid-cols-2 gap-4">
          {/* Membership State */}
          <div>
            <span className="text-muted-foreground text-xs">State:</span>
            <div className="text-accent">{membershipInfo.state || 'N/A'}</div>
          </div>
          
          {/* Basic Info */}
          <div>
            <span className="text-muted-foreground text-xs">Chain ID:</span>
            <div className="text-accent">{membershipInfo.chainId}</div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Rate Limit:</span>
            <div className="text-accent">{membershipInfo.rateLimit} msg/epoch</div>
          </div>

          {/* Contract Info */}
          <div>
            <span className="text-muted-foreground text-xs">Contract Address:</span>
            <div className="text-accent truncate hover:text-clip flex items-center">
              {membershipInfo.address}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-accent"
                onClick={() => membershipInfo.address && copyToClipboard(membershipInfo.address)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Member Details */}
          <div>
            <span className="text-muted-foreground text-xs">Member Index:</span>
            <div className="text-accent">{membershipInfo.treeIndex || 'N/A'}</div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">ID Commitment:</span>
            <div className="text-accent truncate hover:text-clip flex items-center">
              {membershipInfo.idCommitment || 'N/A'}
              {membershipInfo.idCommitment && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-accent"
                  onClick={() => membershipInfo.idCommitment && copyToClipboard(membershipInfo.idCommitment)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Block Information */}
          <div>
            <span className="text-muted-foreground text-xs">Start Block:</span>
            <div className="text-accent">{membershipInfo.startBlock || 'N/A'}</div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">End Block:</span>
            <div className="text-accent">{membershipInfo.endBlock || 'N/A'}</div>
          </div>

          {/* Duration Information */}
          <div>
            <span className="text-muted-foreground text-xs">Active Duration:</span>
            <div className="text-accent">{membershipInfo.activeDuration ? `${membershipInfo.activeDuration} blocks` : 'N/A'}</div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Grace Period:</span>
            <div className="text-accent">{membershipInfo.gracePeriodDuration ? `${membershipInfo.gracePeriodDuration} blocks` : 'N/A'}</div>
          </div>

          {/* Token Information */}
          <div>
            <span className="text-muted-foreground text-xs">Token Address:</span>
            <div className="text-accent truncate hover:text-clip flex items-center">
              {membershipInfo.token || 'N/A'}
              {membershipInfo.token && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-accent"
                  onClick={() => membershipInfo.token && copyToClipboard(membershipInfo.token)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Deposit Amount:</span>
            <div className="text-accent">
              {membershipInfo.depositAmount ? `${ethers.utils.formatEther(membershipInfo.depositAmount)} ETH` : 'N/A'}
            </div>
          </div>

          {/* Holder Information */}
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">Holder Address:</span>
            <div className="text-accent truncate hover:text-clip flex items-center">
              {membershipInfo.holder || 'N/A'}
              {membershipInfo.holder && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-accent"
                  onClick={() => membershipInfo.holder && copyToClipboard(membershipInfo.holder)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 