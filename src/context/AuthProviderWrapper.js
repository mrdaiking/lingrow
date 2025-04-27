'use client';

import { AuthProvider } from './AuthContext';

export default function AuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}