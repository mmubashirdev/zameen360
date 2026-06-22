import { UserProvider } from '../features/marketplace/components/profile/UserContext';
import { BuyerProvider } from '../features/marketplace/components/profile/BuyerContext';
import AppRouter from './routes/Router';
import { AuthProvider } from '@features/auth/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <BuyerProvider>
          <AppRouter />
          <Toaster position="top-right" />
        </BuyerProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
