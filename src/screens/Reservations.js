import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const Reservations = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([]); // [{fecha, status}]
  const [nombreResidente, setNombreResidente] = useState('');

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const nombre = await AsyncStorage.getItem('nombre_residente');
        setNombreResidente(nombre || 'Residente');

        const res = await axios.get('https://inmortalz.shop/evohome-api/getReservations.php');
        const datos = res.data.dates; // [{fecha, status}]
        setUnavailableDates(datos);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    // Llamar al montar
    fetchData();

    // Actualizar cada 2 segundos
    intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []);

  const isUnavailable = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return unavailableDates.some(
      item => item.fecha === dateString && item.status === 'activa' && item.fecha >= today
    );
  };

  const getMarkedDates = () => {
    const marks = {};
    const today = new Date().toISOString().split('T')[0];

    unavailableDates.forEach(item => {
      if (item.status === 'activa' && item.fecha >= today) {
        marks[item.fecha] = {
          disabled: true,
          disableTouchEvent: true,
          marked: true,
          dotColor: 'red',
          customStyles: {
            container: { backgroundColor: 'red' },
            text: { color: 'white', fontWeight: 'bold' }
          }
        };
      }
    });

    if (selectedDate && !isUnavailable(selectedDate)) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: '#579AFF'
      };
    }

    return marks;
  };

  const handleReserve = async () => {
    if (!selectedDate) {
      Alert.alert('Selecciona una fecha', 'Por favor elige un día disponible.');
    } else if (isUnavailable(selectedDate)) {
      Alert.alert('Día no disponible', 'Por favor selecciona otro día.');
    } else {
      try {
        const res = await axios.post('https://inmortalz.shop/evohome-api/addReservation.php', {
          fecha: selectedDate,
          residente: nombreResidente,
          status: 'activa'
        });

        if (res.data.success) {
          Alert.alert('Reservación exitosa', `Reservaste el día ${selectedDate}`);
          setUnavailableDates(prev => [...prev, { fecha: selectedDate, status: 'activa' }]);
          setSelectedDate('');
        } else {
          Alert.alert('Error', res.data.message || 'No se pudo registrar la reservación');
        }
      } catch (error) {
        console.error('Error al reservar:', error);
        Alert.alert('Error', 'No se pudo conectar al servidor');
      }
    }
  };

  return (
    <LinearGradient colors={['#0072E6', '#000']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Quieres realizar un evento, {nombreResidente}?</Text>
      </View>

      <Text style={styles.subtitle}>Sigue estos pasos para realizar tu reservación:</Text>
      <View style={styles.steps}>
        <Text style={styles.step}>• Selecciona el día del evento.</Text>
        <Text style={styles.step}>• Oprime el botón reservar.</Text>
        <Text style={styles.step}>• Tu reservación es exitosa.</Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.redBox} />
        <Text style={styles.legendText}>Día no disponible</Text>
      </View>

      <Calendar
        current={new Date().toISOString().split('T')[0]}
        minDate={new Date().toISOString().split('T')[0]}
        maxDate={'2025-12-31'}
        onDayPress={(day) => {
          const today = new Date().toISOString().split('T')[0];
          if (day.dateString >= today && !isUnavailable(day.dateString)) {
            setSelectedDate(day.dateString);
          }
        }}
        markingType={'custom'}
        markedDates={getMarkedDates()}
        theme={{
          calendarBackground: 'transparent',
          dayTextColor: 'white',
          monthTextColor: 'white',
          textDisabledColor: '#999',
          arrowColor: 'white',
          textSectionTitleColor: '#ccc',
        }}
        style={styles.calendar}
      />

      <TouchableOpacity onPress={handleReserve}>
        <LinearGradient
          colors={['#579AFF', '#012E5D']}
          style={styles.reserveButton}
        >
          <Text style={styles.reserveText}>Reservar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    width: '85%',
  },
  subtitle: {
    marginTop: 20,
    fontSize: 16,
    color: 'white',
  },
  steps: {
    marginVertical: 10,
  },
  step: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  redBox: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    marginRight: 10,
  },
  legendText: {
    color: 'white',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
  },
  reserveButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  reserveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Reservations;
