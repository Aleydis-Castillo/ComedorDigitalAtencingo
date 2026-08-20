import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '../context/AuthContext';
import { OrderProvider } from '../context/OrderContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrderProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />

          <StatusBar style="dark" />
        </>
      </OrderProvider>
    </AuthProvider>
  );
}