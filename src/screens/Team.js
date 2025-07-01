import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';

const integrantes = [
  { nombre: 'Joshua Gonzalez', imagen: require('../../assets/perfil.jpg') },
  { nombre: 'Manuel Medrano', imagen: require('../../assets/perfil3.jpg') },
  { nombre: 'Alfonso Bravo', imagen: require('../../assets/perfil4.jpg') },
  { nombre: 'Edgar Burciaga', imagen: require('../../assets/perfil2.jpg') },
  { nombre: 'Ruben Cardenas', imagen: require('../../assets/perfil5.jpg') },
];

export default function Team() {
  return (
    <LinearGradient colors={['#0072E6', '#000000']} style={styles.container}>
      <Text style={styles.title}>Nuestro equipo</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {integrantes.map((item, index) => (
          <LinearGradient
            key={index}
            colors={['rgba(87, 154, 255, 0.4)', 'rgba(1, 46, 93, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Image source={item.imagen} style={styles.image} />
            <Text style={styles.name}>{item.nombre}</Text>
          </LinearGradient>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backdropFilter: 'blur(10px)', // No tiene efecto en React Native, pero se deja por si usas web.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
