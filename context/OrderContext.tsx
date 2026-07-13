import React, {
  createContext,
  useContext,
  useState,
} from 'react';

interface OrderData {
  foodType: 'breakfast' | 'lunch' | null;

  dish: string | null;

  deliveryType: 'cafeteria' | 'office' | null;

  zone: string | null;

  location: string;

  observations: string;

  setFoodType: (
    value: 'breakfast' | 'lunch' | null
  ) => void;

  setDish: (
    value: string | null
  ) => void;

  setDeliveryType: (
    value: 'cafeteria' | 'office' | null
  ) => void;

  setZone: (
    value: string | null
  ) => void;

  setLocation: (
    value: string
  ) => void;

  setObservations: (
    value: string
  ) => void;

  resetOrder: () => void;
}

const OrderContext = createContext<OrderData>(
  {} as OrderData
);

export function OrderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [foodType, setFoodType] = useState<
    'breakfast' | 'lunch' | null
  >(null);

  const [dish, setDish] =
    useState<string | null>(null);

  const [deliveryType, setDeliveryType] =
    useState<
      'cafeteria' | 'office' | null
    >(null);

  const [zone, setZone] =
    useState<string | null>(null);

  const [location, setLocation] =
    useState('');

  const [observations, setObservations] =
    useState('');

  function resetOrder() {
    setFoodType(null);
    setDish(null);
    setDeliveryType(null);
    setZone(null);
    setLocation('');
    setObservations('');
  }

  return (
    <OrderContext.Provider
      value={{
        foodType,
        dish,
        deliveryType,
        zone,
        location,
        observations,

        setFoodType,
        setDish,
        setDeliveryType,
        setZone,
        setLocation,
        setObservations,

        resetOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}