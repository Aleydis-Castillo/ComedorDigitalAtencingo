import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { OrderProvider } from '../context/OrderContext';

export default function RootLayout() {
  return (
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
  );
}