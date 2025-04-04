"use client";

import React, { useState } from 'react';
import { useKeystore } from '../../../contexts/keystore';
import { readKeystoreFromFile, saveKeystoreCredentialToFile } from '../../../utils/keystore';
import { DecryptedCredentials } from '@waku/rln';
import { useAppState } from '../../../contexts/AppStateContext';
import { TerminalWindow } from '../../ui/terminal-window';
import { Button } from '../../ui/button';
import { Copy, Eye, Download, Trash2, ArrowDownToLine } from 'lucide-react';
import { KeystoreExporter } from '../../KeystoreExporter';
import { keystoreManagement, type ContentSegment } from '../../../content/index';

export function KeystoreManagement() {
  const { 
    hasStoredCredentials, 
    storedCredentialsHashes,
    error,
    exportCredential,
    importKeystore,
    removeCredential,
    getDecryptedCredential
  } = useKeystore();
  const { setGlobalError } = useAppState();
  const [exportPassword, setExportPassword] = useState<string>('');
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState<string>('');
  const [viewingCredential, setViewingCredential] = useState<string | null>(null);
  const [decryptedInfo, setDecryptedInfo] = useState<DecryptedCredentials | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  React.useEffect(() => {
    if (error) {
      setGlobalError(error);
    }
  }, [error, setGlobalError]);

  const handleExportKeystoreCredential = async (hash: string) => {
    try {
      if (!exportPassword) {
        setGlobalError('Please enter your keystore password to export');
        return;
      }
      const keystore = await exportCredential(hash, exportPassword);
      saveKeystoreCredentialToFile(keystore);
      setExportPassword('');
      setSelectedCredential(null);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to export credential');
    }
  };

  const handleImportKeystore = async () => {
    try {
      const keystore = await readKeystoreFromFile();
      const success = importKeystore(keystore);
      if (!success) {
        setGlobalError('Failed to import keystore');
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to import keystore');
    }
  };

  const handleRemoveCredential = (hash: string) => {
    try {
      removeCredential(hash);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to remove credential');
    }
  };

  const handleViewCredential = async (hash: string) => {
    if (!viewPassword) {
      setGlobalError('Please enter your keystore password to view credential');
      return;
    }
    
    setIsDecrypting(true);
    
    try {
      const credential = await getDecryptedCredential(hash, viewPassword);
      setIsDecrypting(false);
      
      if (credential) {
        setDecryptedInfo(credential);
      } else {
        setGlobalError('Could not decrypt credential. Please check your password and try again.');
      }
    } catch (err) {
      setIsDecrypting(false);
      setGlobalError(err instanceof Error ? err.message : 'Failed to decrypt credential');
    }
  };

  // Reset view state when changing credentials
  React.useEffect(() => {
    if (viewingCredential !== selectedCredential) {
      setDecryptedInfo(null);
    }
  }, [viewingCredential, selectedCredential]);

  // Add a function to copy text to clipboard with visual feedback
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedHash(text);
        setTimeout(() => setCopiedHash(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="space-y-6">
      <TerminalWindow className="w-full">
        <h2 className="text-lg font-mono font-medium text-primary mb-4 cursor-blink">
          {keystoreManagement.title}
        </h2>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleImportKeystore} 
              variant="terminal"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                {keystoreManagement.buttons.import}
              </span>
              <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
            </Button>
            
            <KeystoreExporter />
          </div>
          
          {/* Warning - RLN not initialized */}
          {!hasStoredCredentials && (
            <div className="my-4 p-3 border border-warning-DEFAULT/20 bg-warning-DEFAULT/5 rounded">
              <p className="text-sm text-warning-DEFAULT font-mono flex items-center">
                <span className="mr-2">⚠️</span>
                {keystoreManagement.noCredentialsWarning}
              </p>
            </div>
          )}
          
          {/* About Section */}
          <div className="border-t border-terminal-border pt-4 mt-4">
            <div className="flex items-center mb-3">
              <span className="text-primary font-mono font-medium mr-2">{">"}</span>
              <h3 className="text-md font-mono font-semibold text-primary">
                {keystoreManagement.infoHeader}
              </h3>
            </div>
            
            <div className="space-y-3">
              {keystoreManagement.about.map((paragraph: ContentSegment[], i: number) => (
                <p key={i} className="text-sm text-foreground mb-2 opacity-90">
                  {paragraph.map((segment: ContentSegment, j: number) => (
                    segment.type === 'link' ? (
                      <a 
                        key={j}
                        href={segment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {segment.content}
                      </a>
                    ) : (
                      <span key={j}>{segment.content}</span>
                    )
                  ))}
                </p>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="border-t border-terminal-border pt-4">
            <h3 className="text-md font-mono font-semibold text-primary mb-3">
              {keystoreManagement.resources.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {keystoreManagement.resources.links.map((link: { name: string; url: string }, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Stored Credentials */}
          <div className="border-t border-terminal-border pt-6">
            <h3 className="text-sm font-mono font-medium text-muted-foreground mb-4">
              {keystoreManagement.storedCredentialsTitle}
            </h3>
            
            {hasStoredCredentials ? (
              <div className="space-y-4">
                {storedCredentialsHashes.map((hash) => (
                  <div 
                    key={hash} 
                    className="p-4 rounded-md border border-terminal-border bg-terminal-background/30 hover:border-terminal-border/80 transition-colors"
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm text-muted-foreground font-mono">
                            {hash.slice(0, 10)}...{hash.slice(-6)}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-6 w-6 p-0 ${copiedHash === hash ? 'text-success-DEFAULT' : 'text-muted-foreground hover:text-primary'}`}
                            onClick={() => copyToClipboard(hash)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          {copiedHash === hash && (
                            <span className="text-xs text-success-DEFAULT">Copied!</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => {
                              setViewingCredential(hash === viewingCredential ? null : hash);
                              setSelectedCredential(null);
                              setViewPassword('');
                              setDecryptedInfo(null);
                            }}
                            variant="outline"
                            size="sm"
                            className="text-accent hover:text-accent hover:border-accent flex items-center gap-1 py-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{keystoreManagement.buttons.view}</span>
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedCredential(hash === selectedCredential ? null : hash);
                              setViewingCredential(null);
                              setExportPassword('');
                            }}
                            variant="outline"
                            size="sm"
                            className="text-primary hover:text-primary hover:border-primary flex items-center gap-1 py-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export</span>
                          </Button>
                          <Button
                            onClick={() => handleRemoveCredential(hash)}
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:border-destructive flex items-center gap-1 py-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </Button>
                        </div>
                      </div>
                      
                      {/* View Credential Section */}
                      {viewingCredential === hash && (
                        <div className="mt-3 space-y-3 border-t border-terminal-border/40 pt-3 animate-in fade-in-50 duration-300">
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={viewPassword}
                              onChange={(e) => setViewPassword(e.target.value)}
                              placeholder="Enter credential password"
                              className="flex-1 px-3 py-2 border border-terminal-border rounded-md bg-terminal-background text-foreground font-mono focus:ring-1 focus:ring-accent focus:border-accent text-sm"
                              disabled={isDecrypting}
                            />
                            <Button
                              onClick={() => handleViewCredential(hash)}
                              disabled={!viewPassword || isDecrypting}
                              variant="terminal"
                              size="sm"
                            >
                              {isDecrypting ? 'Decrypting...' : 'Decrypt'}
                            </Button>
                          </div>
                          
                          {/* Decrypted Information Display */}
                          {decryptedInfo && (
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
                                  <div className="flex flex-col border-t border-terminal-border/20 pt-2">
                                    <span className="text-muted-foreground">Membership Details:</span>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                      <div>
                                        <span className="text-muted-foreground text-xs">Chain ID:</span>
                                        <div className="text-accent">{decryptedInfo.membership.chainId}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-xs">Rate Limit:</span>
                                        <div className="text-accent">{decryptedInfo.membership.rateLimit}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => setDecryptedInfo(null)}
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-xs text-muted-foreground hover:text-accent"
                                >
                                  Hide Details
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Export Credential Section */}
                      {selectedCredential === hash && (
                        <div className="mt-3 space-y-3 border-t border-terminal-border/40 pt-3 animate-in fade-in-50 duration-300">
                          <input
                            type="password"
                            value={exportPassword}
                            onChange={(e) => setExportPassword(e.target.value)}
                            placeholder="Enter keystore password"
                            className="w-full px-3 py-2 border border-terminal-border rounded-md bg-terminal-background text-foreground font-mono focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                          />
                          <Button
                            onClick={() => handleExportKeystoreCredential(hash)}
                            variant="default"
                            size="sm"
                            className="w-full font-mono"
                            disabled={!exportPassword}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Export Credential
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground font-mono bg-terminal-background/30 p-4 border border-terminal-border/50 rounded-md text-center">
                No credentials stored
              </div>
            )}
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
} 