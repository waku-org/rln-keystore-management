"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  isLoading: boolean;
  globalError: string | null;
  setIsLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('membership');

  const value = {
    isLoading,
    setIsLoading,
    globalError,
    setGlobalError,
    activeTab,
    setActiveTab,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-gray-900 dark:text-white">Loading...</span>
          </div>
        </div>
      )}
      {globalError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center">
          <span>{globalError}</span>
          <button
            onClick={() => setGlobalError(null)}
            className="ml-3 text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
} 