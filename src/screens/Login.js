import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await axios.post('https://inmortalz.shop/evohome-api/login.php', {
        username: emailOrPhone,
        password: password,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('nombre_residente', response.data.nombre_residente);
        await AsyncStorage.setItem('username', emailOrPhone);

        // Guardar controles incluyendo topic
        const controlesString = JSON.stringify(response.data.controles);
        await AsyncStorage.setItem('controles', controlesString);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <LinearGradient colors={['#0072E6', '#000000']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Bienvenido a EvoHome!</Text>

          <Image
            source={{
              uri: 'https://josesilva.es/wp-content/uploads/2023/03/URBANIZACIONES-RESIDENCIALES-LAS-FORTALEZAS-DEL-SIGLO-XXI.jpg',
            }}
            style={styles.image}
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono o correo electrónico"
            placeholderTextColor="#999"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#579AFF', '#012E5D']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Login;

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
    marginBottom: 17,
    color: '#000',
  },
  passwordContainer: {
    width: '90%',
    backgroundColor: '#eee',
    borderRadius: 19,
    paddingHorizontal: 15,
    paddingVertical: 17,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputPassword: {
    flex: 1,
    color: '#000',
  },
  buttonGradient: {
    width: '90%',
    borderRadius: 25,
    marginBottom: 20,
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
  forgotText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});
