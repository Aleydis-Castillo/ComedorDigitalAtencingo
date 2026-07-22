import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import TicketRow from './TicketRow';

interface Props {
  foodType: string;
  dish: string;
  deliveryType: string;
  zone?: string;
  location?: string;
  observations?: string;
}

export default function TicketInfo({
  foodType,
  dish,
  deliveryType,
  zone,
  location,
  observations,
}: Props) {
  return (
    <View style={styles.container}>

      <TicketRow
        icon="silverware-fork-knife"
        title="Tipo"
        value={foodType}
      />

      <TicketRow
        icon="food"
        title="Platillo"
        value={dish}
      />

      <TicketRow
        icon="truck-delivery"
        title="Entrega"
        value={deliveryType}
      />

      {deliveryType === 'Oficina' && (
        <>
          <TicketRow
            icon="factory"
            title="Zona"
            value={zone || '-'}
          />

          <TicketRow
            icon="map-marker"
            title="Ubicación"
            value={location || '-'}
          />
        </>
      )}

      <TicketRow
        icon="note-text-outline"
        title="Observaciones"
        value={
          observations?.trim()
            ? observations
            : 'Sin observaciones'
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    gap: 4,
  },

});