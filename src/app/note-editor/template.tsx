import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>
    {children}
  </Suspense>
}