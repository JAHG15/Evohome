import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ChangePassword = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Por favor completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const username = await AsyncStorage.getItem('username');
      const response = await axios.post('https://inmortalz.shop/evohome-api/change_password.php', {
        username,
        new_password: newPassword,
      });

      if (response.data.success) {
        Alert.alert('Éxito', 'Contraseña actualizada, vuelve a iniciar sesión');
        await AsyncStorage.clear();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        alert('Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error en change_password:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <LinearGradient colors={['#0072E6', '#000000']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Cambia tu contraseña</Text>

          <Image
            source={{
              uri: 'https://scontent.fgdl1-3.fna.fbcdn.net/v/t39.30808-6/475545737_1075152864416501_8205349774076146612_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=jbsag2AnPV0Q7kNvwGTR4oV&_nc_oc=AdmPh2aMwOXv6WCqXicqYyMUKzGny2HW596gbdxu7A_iDWSpFVkADPpuxVQGhfVvHd8&_nc_zt=23&_nc_ht=scontent.fgdl1-3.fna&_nc_gid=IFl1E3y3FWysoRxoyrkv0A&oh=00_AfRAVJFFmfwusW795X1zVS3VLbmqfjpRRHIuIu_VpobI2w&oe=68858FE8',
            }}
            style={styles.image}
          />

          <TextInput
            placeholder="Nueva contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            placeholder="Confirmar contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <LinearGradient
            colors={['#579AFF', '#012E5D']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
container: {
  flexGrow: 1,
  alignItems: 'center',
  padding: 20,
  backgroundColor: 'transparent',
  justifyContent: 'flex-start',  // cambia de 'center' a 'flex-start'
  paddingTop: 20,                // agrega un poco de espacio arriba
},
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  image: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: (width * 0.45) / 2,
    marginBottom: height * 0.05,
  },
  input: {
    width: '90%',
    backgroundColor: '#eee',
    borderRadius: 19,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 20,
    color: '#000',
  },
  buttonGradient: {
    width: '90%',
    borderRadius: 25,
    marginTop: 10,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
