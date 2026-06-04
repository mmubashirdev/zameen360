import React from 'react';
import { UserProvider } from '../features/marketplace/components/profile/UserContext';
import AppRouter from './routes/Router';

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppRouter />
    </UserProvider>
  );
};

export default App;
