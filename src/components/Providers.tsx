'use client';

import { StatsProvider } from './StatsProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StatsProvider>
      {children}
    </StatsProvider>
  );
}
