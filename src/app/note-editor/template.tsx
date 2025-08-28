"use client";
import { ErrorProvider } from '@heritsilavo/react-error-boundary/next';
export default function Template({ children }: { children: React.ReactNode }) {
    return <ErrorProvider>
        {children}
    </ErrorProvider>;
}