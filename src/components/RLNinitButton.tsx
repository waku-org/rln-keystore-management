"use client";

import { useRLN } from '../contexts';
import React from 'react';
import { Button } from './ui/button';

export function RLNInitButton() {
  const { initializeRLN, isInitialized, isStarted, error, isLoading } = useRLN();

  const handleInitialize = async () => {
    try {
      await initializeRLN();
    } catch (err) {
      console.error('Error initializing RLN:', err);
    }
  };

  return (
    <div className="flex flex-col gap-2 font-mono">
      <Button
        onClick={handleInitialize}
        disabled={isLoading || (isInitialized && isStarted)}
        variant={isInitialized && isStarted ? "default" : "terminal"}
        className="w-full sm:w-auto font-mono"
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isInitialized && isStarted && (
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isLoading ? 'Initializing...' : (isInitialized && isStarted) ? 'RLN Initialized' : 'Initialize RLN'}
      </Button>
      
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
} 