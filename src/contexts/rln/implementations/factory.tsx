"use client";

import { createRLN,  RLNCredentialsManager } from '@waku/rln';

export async function createRLNImplementation(type: 'standard' | 'light' = 'light') {
  if (type === 'standard') {
    return await createRLN();
  } else {
    return new RLNCredentialsManager;
  }
} 