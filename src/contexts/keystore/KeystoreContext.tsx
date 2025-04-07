"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Keystore, KeystoreEntity } from '@waku/rln';

export const LOCAL_STORAGE_KEYSTORE_KEY = 'waku-rln-keystore';

interface KeystoreContextType {
  keystore: Keystore | null;
  isInitialized: boolean;
  error: string | null;
  hasStoredCredentials: boolean;
  storedCredentialsHashes: string[];
  decryptedCredentials: KeystoreEntity | null;
  hideCredentials: () => void;
  saveCredentials: (credentials: KeystoreEntity, password: string) => Promise<string>;
  exportCredential: (hash: string, password: string) => Promise<Keystore>;
  exportEntireKeystore: (password: string) => Promise<void>;
  importKeystore: (keystore: Keystore) => boolean;
  removeCredential: (hash: string) => void;
  getDecryptedCredential: (hash: string, password: string) => Promise<KeystoreEntity | null>;
}

const KeystoreContext = createContext<KeystoreContextType | undefined>(undefined);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [keystore, setKeystore] = useState<Keystore | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedCredentialsHashes, setStoredCredentialsHashes] = useState<string[]>([]);
  const [decryptedCredentials, setDecryptedCredentials] = useState<KeystoreEntity | null>(null);

  // Initialize keystore
  useEffect(() => {
    try {
      const storedKeystore = localStorage.getItem(LOCAL_STORAGE_KEYSTORE_KEY);
      let keystoreInstance: Keystore;

      if (storedKeystore) {
        const loaded = Keystore.fromString(storedKeystore);
        if (loaded) {
          keystoreInstance = loaded;
        } else {
          keystoreInstance = Keystore.create();
        }
      } else {
        keystoreInstance = Keystore.create();
      }

      setKeystore(keystoreInstance);
      setStoredCredentialsHashes(keystoreInstance.keys());
      setIsInitialized(true);
    } catch (err) {
      console.error("Error initializing keystore:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize keystore");
    }
  }, []);

  // Save keystore to localStorage whenever it changes
  useEffect(() => {
    if (keystore && isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYSTORE_KEY, keystore.toString());
      } catch (err) {
        console.warn("Could not save keystore to localStorage:", err);
      }
    }
  }, [keystore, isInitialized]);

  const saveCredentials = async (credentials: KeystoreEntity, password: string): Promise<string> => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    try {
      const hash = await keystore.addCredential(credentials, password);
      
      localStorage.setItem(LOCAL_STORAGE_KEYSTORE_KEY, keystore.toString());
      
      setStoredCredentialsHashes(keystore.keys());
      
      return hash;
    } catch (err) {
      console.error("Error saving credentials:", err);
      throw err;
    }
  };

  const getDecryptedCredential = async (hash: string, password: string): Promise<KeystoreEntity | null> => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    try {
      // Get the credential from the keystore
      const credential = await keystore.readCredential(hash, password);
      if (credential) {
        setDecryptedCredentials(credential);
      }
      return credential || null;
    } catch (err) {
      console.error("Error reading credential:", err);
      throw err;
    }
  };

  const exportCredential = async (hash: string, password: string): Promise<Keystore> => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    // Create a new keystore instance for the single credential
    const singleCredentialKeystore = Keystore.create();
    
    // Get the credential from the main keystore
    const credential = await keystore.readCredential(hash, password);
    if (!credential) {
      throw new Error("Credential not found");
    }
    
    // Add the credential to the new keystore
    await singleCredentialKeystore.addCredential(credential, password);
    console.log("Single credential keystore:", singleCredentialKeystore.toString());
    return singleCredentialKeystore;
  };

  const exportEntireKeystore = async (password: string): Promise<void> => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    if (storedCredentialsHashes.length === 0) {
      throw new Error("No credentials to export");
    }

    try {
      // Verify the password works for at least one credential
      const firstHash = storedCredentialsHashes[0];
      const testCredential = await keystore.readCredential(firstHash, password);
      
      if (!testCredential) {
        throw new Error("Invalid password");
      }
      
      // If password is verified, export the entire keystore
      const filename = 'waku-rln-keystore.json';
      const blob = new Blob([keystore.toString()], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting keystore:", err);
      throw err;
    }
  };

  const importKeystore = (keystore: Keystore): boolean => {
    try {
      setKeystore(keystore);
      setStoredCredentialsHashes(keystore.keys());
      localStorage.setItem(LOCAL_STORAGE_KEYSTORE_KEY, keystore.toString());
      return true;
    } catch (err) {
      console.error("Error importing keystore:", err);
      setError(err instanceof Error ? err.message : "Failed to import keystore");
      return false;
    }
  };

  const removeCredential = (hash: string): void => {
    if (!keystore) {
      throw new Error("Keystore not initialized");
    }

    keystore.removeCredential(hash);
    setStoredCredentialsHashes(keystore.keys());
    localStorage.setItem(LOCAL_STORAGE_KEYSTORE_KEY, keystore.toString());
  };

  const contextValue: KeystoreContextType = {
    keystore,
    isInitialized,
    error,
    hasStoredCredentials: storedCredentialsHashes.length > 0,
    storedCredentialsHashes,
    saveCredentials,
    exportCredential,
    exportEntireKeystore,
    importKeystore,
    removeCredential,
    getDecryptedCredential
  };

  return (
    <KeystoreContext.Provider value={contextValue}>
      {children}
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  const context = useContext(KeystoreContext);
  if (context === undefined) {
    throw new Error('useKeystore must be used within a KeystoreProvider');
  }
  return context;
} 