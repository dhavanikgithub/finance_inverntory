// store/Provider.tsx

'use client';  // Mark this file as a client component for Next.js

import { Provider } from 'react-redux';
import store from './store';  // Import the store you just created
import { ReactNode } from 'react'; // Import ReactNode for typing the children prop

interface StoreProviderProps {
  children: ReactNode;  // Define the type for children
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
