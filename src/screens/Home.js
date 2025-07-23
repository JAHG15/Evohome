import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import mqtt from 'mqtt';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.9;
const iconSize = width * 0.065;

const Home = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [nombreResidente, setNombreResidente] = useState(null);
  const [controles, setControles] = useState([]);
  const [switches, setSwitches] = useState({});
  const [mqttClient, setMqttClient] = useState(null);
  const [username, setUsername] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fixedImageUri =
    'https://scontent.fgdl1-3.fna.fbcdn.net/v/t39.30808-6/475545737_1075152864416501_8205349774076146612_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=jbsag2AnPV0Q7kNvwGTR4oV&_nc_oc=AdmPh2aMwOXv6WCqXicqYyMUKzGny2HW596gbdxu7A_iDWSpFVkADPpuxVQGhfVvHd8&_nc_zt=23&_nc_ht=scontent.fgdl1-3.fna&_nc_gid=IFl1E3y3FWysoRxoyrkv0A&oh=00_AfRAVJFFmfwusW795X1zVS3VLbmqfjpRRHIuIu_VpobI2w&oe=68858FE8';

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

      const controlesJSON = await AsyncStorage.getItem('controles');
      const parsedControles = controlesJSON ? JSON.parse(controlesJSON) : [];
      setControles(parsedControles);

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

  useEffect(() => {
    loadProfileData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
    }, [])
  );

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
      navigation.reset({ index: 0, routes: [{ name: 'Public' }] });
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  };

  return (
    <LinearGradient colors={['#0072E6', '#000']} style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: fixedImageUri }} style={styles.avatar} />
          </TouchableOpacity>

          <Text style={styles.greeting}>Hola, {nombreResidente || 'Residente'}!</Text>

          <View style={styles.rightIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Reservations')} style={styles.iconButton}>
              <Ionicons name="calendar-outline" size={iconSize} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWhatsApp} style={styles.iconButton}>
              <Feather name="message-circle" size={iconSize} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.iconButton}>
              <Feather name="menu" size={iconSize + 2} color="white" />
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

        {/* Modal de Imagen */}
        <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <Image source={{ uri: fixedImageUri }} style={styles.modalImage} resizeMode="cover" />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Scroll principal */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Clima */}
          <LinearGradient colors={['#004080', '#000']} style={styles.weatherCard}>
            <Text style={styles.location}>{weatherData?.location?.name || 'Ubicación'}</Text>
            <View style={styles.weatherContent}>
              {loadingWeather ? (
                <Text style={styles.temperature}>Cargando...</Text>
              ) : weatherData ? (
                <>
                  <Text style={styles.temperature}>{Math.round(weatherData.current.temp_c)}°</Text>
                  <Ionicons name="sunny" size={iconSize * 1.5} color="yellow" />
                </>
              ) : (
                <Text style={styles.temperature}>No disponible</Text>
              )}
            </View>
          </LinearGradient>

          {/* Controles */}
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

// ==============================
// ESTILOS
// ==============================

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: width * 0.05, paddingTop: height * 0.2, paddingBottom: height * 0.05 },
  header: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.05,
    right: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  avatar: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: (width * 0.13) / 2,
  },
  greeting: {
    flex: 1,
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginLeft: width * 0.03,
  },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: width * 0.015 },
  menu: {
    position: 'absolute',
    top: height * 0.11,
    right: width * 0.05,
    backgroundColor: 'black',
    padding: width * 0.03,
    borderRadius: 10,
    zIndex: 20,
  },
  menuItem: { paddingVertical: 8 },
  menuItemText: { color: 'white', fontSize: width * 0.045 },
  weatherCard: {
    borderRadius: 15,
    padding: width * 0.04,
    marginTop: height * 0.015,
  },
  location: { color: 'white', fontSize: width * 0.04 },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperature: { fontSize: width * 0.1, color: 'white' },
  sectionTitle: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: height * 0.025,
  },
  controlCard: {
    width: '100%',
    borderRadius: 15,
    padding: width * 0.04,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  switchText: { color: 'white', fontSize: width * 0.04 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
});
