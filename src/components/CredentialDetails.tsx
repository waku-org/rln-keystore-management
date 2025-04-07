import React from 'react';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { DecryptedCredentials } from '@waku/rln';

interface CredentialDetailsProps {
  decryptedInfo: DecryptedCredentials;
  copyToClipboard: (text: string) => void;
}

export function CredentialDetails({ decryptedInfo, copyToClipboard }: CredentialDetailsProps) {
  return (
    <div className="mt-3 space-y-2 border-t border-terminal-border/40 pt-3 animate-in fade-in-50 duration-300">
      <div className="flex items-center mb-2">
        <span className="text-primary font-mono font-medium mr-2">{">"}</span>
        <h3 className="text-sm font-mono font-semibold text-primary">
          Credential Details
        </h3>
      </div>
      <div className="space-y-2 text-xs font-mono">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground">ID Commitment:</span>
            <div className="flex items-center mt-1">
              <span className="break-all text-accent truncate">{decryptedInfo.identity.IDCommitment}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-accent"
                onClick={() => copyToClipboard(decryptedInfo.identity.IDCommitment.toString())}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">ID Commitment BigInt:</span>
            <div className="flex items-center mt-1">
              <span className="break-all text-accent truncate">{decryptedInfo.identity.IDCommitmentBigInt}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-accent"
                onClick={() => copyToClipboard(decryptedInfo.identity.IDCommitmentBigInt.toString())}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col border-t border-terminal-border/20 pt-2">
            <span className="text-muted-foreground">ID Nullifier:</span>
            <div className="flex items-center mt-1">
              <span className="break-all text-accent truncate">{decryptedInfo.identity.IDNullifier}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-accent"
                onClick={() => copyToClipboard(decryptedInfo.identity.IDNullifier.toString())}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 