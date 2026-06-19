import { UserProvider } from '../features/marketplace/components/profile/UserContext';
import { BuyerProvider } from '../features/marketplace/components/profile/BuyerContext';
import AppRouter from './routes/Router';
import { AuthProvider } from '@features/auth/context/AuthContext';

const App = () => {
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