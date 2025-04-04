"use client";

import { useRLNImplementation } from '../contexts';
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function RLNImplementationToggle() {
  const { implementation, setImplementation } = useRLNImplementation();

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-mono text-muted-foreground">
        RLN Implementation
      </label>
      
      <ToggleGroup 
        type="single" 
        value={implementation} 
        onValueChange={(value) => {
          if (value) setImplementation(value as 'light' | 'standard');
        }}
        className="w-full max-w-md"
      >
        <ToggleGroupItem value="light" className="flex-1">
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value="standard" className="flex-1">
          Standard
        </ToggleGroupItem>
      </ToggleGroup>
      
      <p className="text-xs font-mono text-muted-foreground opacity-80">
        {implementation === 'light'
          ? 'Light implementation, without Zerokit. Instant initialisation.'
          : 'Standard implementation, with Zerokit. Initialisation takes 10-15 seconds for WASM module.'
        }
      </p>
    </div>
  );
}