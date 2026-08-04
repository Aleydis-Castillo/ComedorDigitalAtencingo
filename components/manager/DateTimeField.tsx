import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { COLORS } from '../../constants/colors';

interface DateTimeFieldProps {
  label: string;
  mode: 'date' | 'time';
  value: Date;
  onChange: (value: Date) => void;
  disabled?: boolean;
}

export default function DateTimeField({
  label,
  mode,
  value,
  onChange,
  disabled = false,
}: DateTimeFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TouchableOpacity
        style={[
          styles.field,
          disabled && styles.disabledField,
        ]}
        activeOpacity={0.75}
        disabled={disabled}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={
              mode === 'date'
                ? 'calendar-month-outline'
                : 'clock-outline'
            }
            size={22}
            color={
              disabled
                ? COLORS.gray
                : COLORS.primary
            }
          />
        </View>

        <Text
          style={[
            styles.valueText,
            disabled && styles.disabledText,
          ]}
        >
          {mode === 'date'
            ? formatDate(value)
            : formatTime(value)}
        </Text>

        {!disabled && (
          <MaterialCommunityIcons
            name="chevron-down"
            size={23}
            color={COLORS.gray}
          />
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={
            Platform.OS === 'ios'
              ? 'spinner'
              : 'default'
          }
          is24Hour
          onChange={handleChange}
        />
      )}

      {Platform.OS === 'ios' && showPicker && (
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.8}
          onPress={() => setShowPicker(false)}
        >
          <Text style={styles.confirmButtonText}>
            Confirmar
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  field: {
    height: 58,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DCE5DD',
    borderRadius: 17,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },

  disabledField: {
    backgroundColor: '#F1F3F1',
  },

  iconContainer: {
    width: 38,
    height: 38,
    marginRight: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF7EF',
  },

  valueText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },

  disabledText: {
    color: COLORS.gray,
  },

  confirmButton: {
    height: 46,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
});