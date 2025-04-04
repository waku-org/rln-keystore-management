"use client";

import React from 'react';
import { Layout } from '../components/Layout';
import { MembershipRegistration } from '../components/Tabs/MembershipTab/MembershipRegistration';
import { KeystoreManagement } from '../components/Tabs/KeystoreTab/KeystoreManagement';

export default function Home() {
  return (
    <Layout>
      <MembershipRegistration />
      <KeystoreManagement />
    </Layout>
  );
}