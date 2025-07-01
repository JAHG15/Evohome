import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Profile({ route, navigation }) {
  const [imageUri, setImageUri] = useState(route.params?.currentImage);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUsername = async () => {
      const user = await AsyncStorage.getItem('username');
      setUsername(user);
    };
    getUsername();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const handleSave = async () => {
    if (imageUri && username) {
      try {
        await AsyncStorage.setItem(`profileImage_${username}`, imageUri);
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Error al guardar imagen');
      }
    } else {
      Alert.alert('Selecciona una imagen primero');
    }
  };

  return (
    <LinearGradient colors={['#0072E6', '#000']} style={styles.container}>
      <Text style={styles.title}>Actualizar foto de perfil</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: imageUri || 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.image}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave}>
        <LinearGradient colors={['#579AFF', '#012E5D']} style={styles.button}>
          <Text style={styles.buttonText}>Guardar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 150, height: 150, borderRadius: 75, marginBottom: 30 },
  button: { padding: 15, borderRadius: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
});
