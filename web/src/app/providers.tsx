"use client";

import { TimelineProvider } from "../context/timeline/TimelineContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TimelineProvider>{children}</TimelineProvider>;
}
