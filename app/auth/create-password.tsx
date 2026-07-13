import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import CustomInput from '../../components/inputs/CustomInput';
import { COLORS } from '../../constants/colors';


export default function CreatePassword() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Crear contraseña
      </Text>


      <Text style={styles.subtitle}>
        Crea una contraseña segura
      </Text>


      <CustomInput
        placeholder="Contraseña"
        secureTextEntry={!showPassword}
        rightIcon={
          <Ionicons
            name={
              showPassword
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={24}
            color={COLORS.gray}
            onPress={() =>
              setShowPassword(!showPassword)
            }
          />
        }
      />


      <CustomInput
        placeholder="Confirmar contraseña"
        secureTextEntry={!showConfirmPassword}
        rightIcon={
          <Ionicons
            name={
              showConfirmPassword
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={24}
            color={COLORS.gray}
            onPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />
        }
      />


      <PrimaryButton
        title="Guardar"
        onPress={() =>
          router.replace('/employee/dashboard')
        }
      />


    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 25,
    justifyContent: 'center',
  },


  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },


  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 40,
  },

});