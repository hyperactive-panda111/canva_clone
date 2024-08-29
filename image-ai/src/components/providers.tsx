'use client';

import { QueryProvider } from './query-provider';

interface ProvidersProps {
    children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
    return (
        <QueryProvider>
            {children}
        </QueryProvider>
    );
};

export default Providers;