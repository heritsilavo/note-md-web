import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="w-[100dvw] h-[calc(100vh-(53px+68px))] overflow-x-hidden overflow-y-scroll">
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  </div>
}