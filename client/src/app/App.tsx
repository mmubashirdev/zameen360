import React from 'react';
import { UserProvider } from '../features/marketplace/components/profile/UserContext';
import { BuyerProvider } from '../features/marketplace/components/profile/BuyerContext';
import AppRouter from './routes/Router';
import { AuthProvider } from '@features/auth/context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <BuyerProvider>
          <AppRouter />
        </BuyerProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;