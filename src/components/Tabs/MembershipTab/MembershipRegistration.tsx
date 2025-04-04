"use client";

import React, { useState, useEffect } from 'react';
import { RLNImplementationToggle } from '../../RLNImplementationToggle';
import { KeystoreEntity } from '@waku/rln';
import { useAppState } from '../../../contexts/AppStateContext';
import { useRLN } from '../../../contexts/rln/RLNContext';
import { useWallet } from '../../../contexts/wallet';
import { RLNInitButton } from '../../RLNinitButton';
import { TerminalWindow } from '../../ui/terminal-window';
import { Slider } from '../../ui/slider';
import { Button } from '../../ui/button';
import { membershipRegistration, type ContentSegment } from '../../../content/index';

export function MembershipRegistration() {
  const { setGlobalError } = useAppState();
  const { registerMembership, isInitialized, isStarted, rateMinLimit, rateMaxLimit, error } = useRLN();
  const { isConnected, chainId } = useWallet();

  const [rateLimit, setRateLimit] = useState<number>(rateMinLimit);
  const [isRegistering, setIsRegistering] = useState(false);
  const [saveToKeystore, setSaveToKeystore] = useState(true);
  const [keystorePassword, setKeystorePassword] = useState('');
  const [registrationResult, setRegistrationResult] = useState<{
    success?: boolean;
    error?: string;
    txHash?: string;
    warning?: string;
    credentials?: KeystoreEntity;
    keystoreHash?: string;
  }>({});

  const isLineaSepolia = chainId === 59141;

  useEffect(() => {
    if (error) {
      setGlobalError(error);
    }
  }, [error, setGlobalError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setRegistrationResult({ success: false, error: 'Please connect your wallet first' });
      return;
    }
    
    if (!isInitialized || !isStarted) {
      setRegistrationResult({ success: false, error: 'RLN is not initialized' });
      return;
    }
    
    if (!isLineaSepolia) {
      setRegistrationResult({ success: false, error: 'Please switch to Linea Sepolia network' });
      return;
    }
    
    // Validate keystore password if saving to keystore
    if (saveToKeystore && keystorePassword.length < 8) {
      setRegistrationResult({ 
        success: false, 
        error: 'Keystore password must be at least 8 characters long' 
      });
      return;
    }
    
    setIsRegistering(true);
    setRegistrationResult({});
    
    try {
      setRegistrationResult({ 
        success: undefined, 
        warning: 'Please check your wallet to sign the registration message.' 
      });
      
      // Pass save options if saving to keystore
      const saveOptions = saveToKeystore ? { password: keystorePassword } : undefined;
      
      const result = await registerMembership(rateLimit, saveOptions);
      
      setRegistrationResult({
        ...result,
        credentials: result.credentials
      });
      
      // Clear password field after successful registration
      if (result.success) {
        setKeystorePassword('');
      }
    } catch (error) {
      setRegistrationResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <TerminalWindow className="w-full">
        <h2 className="text-lg font-mono font-medium text-primary mb-4 cursor-blink">
          {membershipRegistration.title}
        </h2>
        <div className="space-y-6">
          <div className="border-b border-terminal-border pb-6">
            <RLNImplementationToggle />
          </div>

          {/* Network Warning */}
          {isConnected && !isLineaSepolia && (
            <div className="mb-4 p-3 border border-destructive/20 bg-destructive/5 rounded">
              <p className="text-sm text-destructive font-mono flex items-center">
                <span className="mr-2">⚠️</span>
                <span>{membershipRegistration.networkWarning}</span>
              </p>
            </div>
          )}
          
          {/* Informational Box */}
          <div className="border-t border-terminal-border pt-4 mt-4">
            <div className="flex items-center mb-3">
              <span className="text-primary font-mono font-medium mr-2">{">"}</span>
              <h3 className="text-md font-mono font-semibold text-primary">
                {membershipRegistration.infoHeader}
              </h3>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-md font-mono font-semibold text-primary cursor-blink">
                {membershipRegistration.aboutTitle}
              </h4>
              {membershipRegistration.about.map((paragraph: ContentSegment[], i: number) => (
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

          <div className="border-t border-terminal-border pt-6 mt-4">
            <div className="flex items-center space-x-2">
              <RLNInitButton />
            </div>

            {!isConnected ? (
              <div className="text-warning-DEFAULT font-mono text-sm mt-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                {membershipRegistration.connectWalletPrompt}
              </div>
            ) : !isInitialized || !isStarted ? (
              <div className="text-warning-DEFAULT font-mono text-sm mt-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                {membershipRegistration.initializePrompt}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label 
                    htmlFor="rateLimit" 
                    className="block text-sm font-mono text-muted-foreground mb-2"
                  >
                    {membershipRegistration.form.rateLimitLabel}
                  </label>
                  <div className="flex items-center space-x-4 py-2">
                    <Slider
                      id="rateLimit"
                      min={rateMinLimit}
                      max={rateMaxLimit}
                      value={[rateLimit]}
                      onValueChange={(value) => setRateLimit(value[0])}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground w-12 font-mono">
                      {rateLimit}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="saveToKeystore"
                      checked={saveToKeystore}
                      onChange={(e) => setSaveToKeystore(e.target.checked)}
                      className="h-4 w-4 rounded bg-terminal-background border-terminal-border text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="saveToKeystore"
                      className="ml-2 text-sm font-mono text-foreground"
                    >
                      {membershipRegistration.form.saveToKeystoreLabel}
                    </label>
                  </div>

                  {saveToKeystore && (
                    <div>
                      <label
                        htmlFor="keystorePassword"
                        className="block text-sm font-mono text-muted-foreground mb-2"
                      >
                        {membershipRegistration.form.passwordLabel}
                      </label>
                      <input
                        type="password"
                        id="keystorePassword"
                        value={keystorePassword}
                        onChange={(e) => setKeystorePassword(e.target.value)}
                        placeholder={membershipRegistration.form.passwordPlaceholder}
                        className="w-full px-3 py-2 bg-terminal-background border border-terminal-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full"
                >
                  {isRegistering ? membershipRegistration.form.registeringButton : membershipRegistration.form.registerButton}
                </Button>
              </form>
            )}
          </div>

          {/* Registration Result */}
          {registrationResult.warning && (
            <div className="mt-4 p-3 border border-warning-DEFAULT/20 bg-warning-DEFAULT/5 rounded">
              <p className="text-sm text-warning-DEFAULT font-mono flex items-center">
                <span className="mr-2">⚠️</span>
                {registrationResult.warning}
              </p>
            </div>
          )}
          {registrationResult.error && (
            <div className="mt-4 p-3 border border-destructive/20 bg-destructive/5 rounded">
              <p className="text-sm text-destructive font-mono flex items-center">
                <span className="mr-2">⚠️</span>
                {registrationResult.error}
              </p>
            </div>
          )}
          {registrationResult.success && (
            <div className="mt-4 p-3 border border-success-DEFAULT/20 bg-success-DEFAULT/5 rounded">
              <p className="text-sm text-success-DEFAULT font-mono mb-2 flex items-center">
                <span className="mr-2">✓</span>
                Membership registered successfully!
              </p>
              {registrationResult.txHash && (
                <p className="text-xs text-success-DEFAULT font-mono opacity-80 break-all">
                  Transaction Hash: {registrationResult.txHash}
                </p>
              )}
            </div>
          )}
        </div>
      </TerminalWindow>
    </div>
  );
} 