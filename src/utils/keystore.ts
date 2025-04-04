/**
 * Utility functions for handling keystore file operations
 */

import { Keystore } from "@waku/rln";

/**
 * Save a keystore JSON string to a file
 * @param keystoreJson The keystore JSON as a string
 * @param filename Optional filename (defaults to 'waku-rln-keystore.json')
 */
export const saveKeystoreCredentialToFile = (keystore: Keystore): void => {
  let filename: string;
  if (keystore.keys.length > 1) {
    filename = 'waku-rln-keystore.json';
  } else {
    const slicedHash = keystore.keys()[0].slice(0,8)
    filename = `waku-rln-credential-${slicedHash}.json`;
  }
  const blob = new Blob([keystore.toString()], { type: 'application/json' });
  
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  
  link.click();
  
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

/**
 * Read a keystore file and return it as a Keystore object
 * @returns Promise resolving to a Keystore object
 */
export const readKeystoreFromFile = (): Promise<Keystore> => {
  return new Promise<Keystore>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file: File | undefined = target.files?.[0];
      
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const content = reader.result as string;
          const keystore = Keystore.fromString(content);
          if (!keystore) {
            reject(new Error('Failed to create keystore from file'));
            return;
          }
          resolve(keystore);
        } catch (e) {
          reject(new Error(`Invalid keystore file format: ${e instanceof Error ? e.message : String(e)}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  });
}; 