import React, {
  createContext,
  useContext,
  useState,
} from 'react';

type FoodType =
  | 'breakfast'
  | 'lunch'
  | null;

type DeliveryType =
  | 'cafeteria'
  | 'office'
  | null;

interface OrderData {
  foodType: FoodType;

  dish: string | null;
  dishId: string | null;

  deliveryType: DeliveryType;


  zone: string | null;

 
  location: string;

  
  profileLocation: string;

  /*
   * true:
   * usamos profileLocation
   *
   * false:
   * el usuario escribió una ubicación
   * diferente solamente para este pedido.
   */
  useProfileLocation: boolean;

  observations: string;

  setFoodType: (
    value: FoodType
  ) => void;

  setDish: (
    value: string | null
  ) => void;

  setDishId: (
    value: string | null
  ) => void;

  setDeliveryType: (
    value: DeliveryType
  ) => void;

  setZone: (
    value: string | null
  ) => void;

  setLocation: (
    value: string
  ) => void;

  setProfileLocation: (
    value: string
  ) => void;

  setUseProfileLocation: (
    value: boolean
  ) => void;

  setObservations: (
    value: string
  ) => void;

 
  applyProfileLocation:
    () => void;

  resetDelivery:
    () => void;

  resetOrder:
    () => void;
}

const OrderContext =
  createContext<OrderData>(
    {} as OrderData,
  );

export function OrderProvider({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const [
    foodType,
    setFoodType,
  ] =
    useState<FoodType>(
      null,
    );

  const [
    dish,
    setDish,
  ] =
    useState<
      string | null
    >(null);

  const [
    dishId,
    setDishId,
  ] =
    useState<
      string | null
    >(null);

  const [
    deliveryType,
    setDeliveryType,
  ] =
    useState<DeliveryType>(
      null,
    );

  const [
    zone,
    setZone,
  ] =
    useState<
      string | null
    >(null);

  const [
    location,
    setLocation,
  ] =
    useState('');

  const [
    profileLocation,
    setProfileLocation,
  ] =
    useState('');

  const [
    useProfileLocation,
    setUseProfileLocation,
  ] =
    useState(true);

  const [
    observations,
    setObservations,
  ] =
    useState('');

 
  function applyProfileLocation() {
    setLocation(
      profileLocation,
    );

    setUseProfileLocation(
      true,
    );
  }

  function resetDelivery() {
    setDeliveryType(null);
    setZone(null);
    setLocation('');

    setUseProfileLocation(
      true,
    );
  }


  function resetOrder() {
    setFoodType(null);

    setDish(null);
    setDishId(null);

    setDeliveryType(null);

    setZone(null);
    setLocation('');

    setUseProfileLocation(
      true,
    );

    setObservations('');
  }

  return (
    <OrderContext.Provider
      value={{
        foodType,

        dish,
        dishId,

        deliveryType,

        zone,
        location,

        profileLocation,
        useProfileLocation,

        observations,

        setFoodType,

        setDish,
        setDishId,

        setDeliveryType,

        setZone,
        setLocation,

        setProfileLocation,
        setUseProfileLocation,

        setObservations,

        applyProfileLocation,

        resetDelivery,
        resetOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(
    OrderContext,
  );
}