import React, {
    createContext,
    useContext,
    useState,
} from 'react';

interface OrderData {
  foodType: 'breakfast' | 'lunch' | null;

  dish: string | null;

  deliveryType: 'cafeteria' | 'office' | null;

  officeArea: string | null;

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

  setOfficeArea: (
    value: string | null
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

  const [dish, setDish] = useState<string | null>(null);

  const [deliveryType, setDeliveryType] = useState<
    'cafeteria' | 'office' | null
  >(null);

  const [officeArea, setOfficeArea] = useState<string | null>(null);

  const [observations, setObservations] =
    useState('');

  function resetOrder() {
    setFoodType(null);
    setDish(null);
    setDeliveryType(null);
    setOfficeArea(null);
    setObservations('');
  }

  return (
    <OrderContext.Provider
      value={{
        foodType,
        dish,
        deliveryType,
        officeArea,
        observations,

        setFoodType,
        setDish,
        setDeliveryType,
        setOfficeArea,
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