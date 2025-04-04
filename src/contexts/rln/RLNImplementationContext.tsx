"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type RLNImplementationType = 'standard' | 'light';

interface RLNImplementationContextType {
  implementation: RLNImplementationType;
  setImplementation: (implementation: RLNImplementationType) => void;
}

const RLNImplementationContext = createContext<RLNImplementationContextType | undefined>(undefined);

export function RLNImplementationProvider({ children }: { children: ReactNode }) {
  const [implementation, setImplementation] = useState<RLNImplementationType>('light');

  return (
    <RLNImplementationContext.Provider value={{ implementation, setImplementation }}>
      {children}
    </RLNImplementationContext.Provider>
  );
}

export function useRLNImplementation() {
  const context = useContext(RLNImplementationContext);
  if (context === undefined) {
    throw new Error('useRLNImplementation must be used within a RLNImplementationProvider');
  }
  return context;
} 