import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import mqtt from 'mqtt';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Home = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [nombreResidente, setNombreResidente] = useState(null);
  const [controles, setControles] = useState([]);
  const [switches, setSwitches] = useState({});
  const [mqttClient, setMqttClient] = useState(null);
  const [username, setUsername] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const toggleSwitch = async (key, topic) => {
    const newState = !switches[key];
    const updatedSwitches = { ...switches, [key]: newState };
    setSwitches(updatedSwitches);

    if (mqttClient && topic) {
      mqttClient.publish(topic, newState ? 'ON' : 'OFF');
    }

    if (username) {
      await AsyncStorage.setItem(`switches_${username}`, JSON.stringify(updatedSwitches));
    }
  };

  useEffect(() => {
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');
    client.on('connect', () => console.log('✅ Conectado al broker MQTT'));
    client.on('error', (err) => console.log('❌ Error en MQTT:', err));
    setMqttClient(client);
    return () => client.end();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);

      const storedNombre = await AsyncStorage.getItem('nombre_residente');
      setNombreResidente(storedNombre);

      const storedImage = await AsyncStorage.getItem(`profileImage_${storedUsername}`);
      setProfileImage(storedImage || 'https://randomuser.me/api/portraits/men/1.jpg');

      const controlesJSON = await AsyncStorage.getItem('controles');
      const parsedControles = controlesJSON ? JSON.parse(controlesJSON) : [];
      setControles(parsedControles);

      // Cargar switches por usuario
      const storedSwitchesJSON = await AsyncStorage.getItem(`switches_${storedUsername}`);
      const storedSwitches = storedSwitchesJSON ? JSON.parse(storedSwitchesJSON) : {};

      const initialStates = {};
      parsedControles.forEach((control) => {
        initialStates[control.control] = storedSwitches.hasOwnProperty(control.control)
          ? storedSwitches[control.control]
          : false;
      });

      setSwitches(initialStates);
    } catch (error) {
      console.log('Error al cargar datos:', error);
    }
  };

  useEffect(() => { loadProfileData(); }, []);
  useFocusEffect(React.useCallback(() => { loadProfileData(); }, []));

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoadingWeather(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=f94d99ee33fe431790c153421251306&q=${location.coords.latitude},${location.coords.longitude}&lang=es`
        );
        const data = await response.json();
        setWeatherData(data?.current ? data : null);
      } catch (error) {
        console.log('Error al obtener clima:', error);
        setWeatherData(null);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  const openWhatsApp = () => {
    const phoneNumber = '5216183692086';
    const message = 'Hola que tal, quiero reportar un problema\nDescripcion del problema:';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('nombre_residente');
      await AsyncStorage.removeItem('controles');
      // No borres los switches aquí para que se mantengan
      navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  };

  return (
    <LinearGradient colors={['#0072E6', '#000']} style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { currentImage: profileImage })}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          </TouchableOpacity>

          <Text style={styles.greeting}>Hola, {nombreResidente || 'Residente'}!</Text>

          <View style={styles.rightIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Reservations')} style={styles.iconButton}>
              <Ionicons name="calendar-outline" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWhatsApp} style={styles.iconButton}>
              <Feather name="message-circle" size={26} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.iconButton}>
              <Feather name="menu" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scroll}>
          <LinearGradient colors={['#004080', '#000']} style={styles.weatherCard}>
            <Text style={styles.location}>{weatherData?.location?.name || 'Ubicación'}</Text>
            <View style={styles.weatherContent}>
              {loadingWeather ? (
                <Text style={styles.temperature}>Cargando...</Text>
              ) : weatherData ? (
                <>
                  <Text style={styles.temperature}>{Math.round(weatherData.current.temp_c)}°</Text>
                  <Ionicons name="sunny" size={40} color="yellow" />
                </>
              ) : (
                <Text style={styles.temperature}>No disponible</Text>
              )}
            </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>Controles</Text>
          <LinearGradient colors={['#0072E6', '#000']} style={styles.controlCard}>
            {controles.map(({ control, topic }) => (
              <View style={styles.switchRow} key={control}>
                <Text style={styles.switchText}>{control}</Text>
                <Switch value={switches[control]} onValueChange={() => toggleSwitch(control, topic)} />
              </View>
            ))}
          </LinearGradient>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 135 },
  header: {
    position: 'absolute', top: 70, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  greeting: { flex: 1, color: 'white', fontSize: 25, fontWeight: 'bold', marginLeft: 10 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8 },
  menu: {
    position: 'absolute', top: 90, right: 20, backgroundColor: 'black',
    padding: 10, borderRadius: 10, zIndex: 20,
  },
  menuItem: { paddingVertical: 8 },
  menuItemText: { color: 'white', fontSize: 17.5 },
  weatherCard: { borderRadius: 15, padding: 15, marginTop: 20 },
  location: { color: 'white', fontSize: 16 },
  weatherContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  temperature: { fontSize: 40, color: 'white' },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
  controlCard: { width: '100%', borderRadius: 15, padding: 15 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  switchText: { color: 'white', fontSize: 14 },
});
