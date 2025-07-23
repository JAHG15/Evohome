import { LinearGradient } from 'expo-linear-gradient';
import { useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

const logo = require('../../assets/Logo.png');
const slide = require('../../assets/slide-pica.png');

const Public = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Image
          source={logo}
          style={{ width: 190, height: 190, marginLeft: 3, marginTop: 20 }}
          resizeMode="contain"
        />
      ),
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} style={{ marginRight: 15 }}>
              <Icon name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              navigation.navigate('Login');
            }}
            title="Iniciar sesión"
            titleStyle={styles.menuText}
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              navigation.navigate('Team');
            }}
            title="Equipo de desarrollo"
            titleStyle={styles.menuText}
          />
        </Menu>
      ),
      headerStyle: {
        backgroundColor: '#0072E6',
      },
      headerTitle: '',
      headerRightContainerStyle: {
        paddingRight: 10,
      },
      headerLeftContainerStyle: {
        paddingLeft: 10,
      },
    });
  }, [navigation, menuVisible]);

  return (
    <LinearGradient colors={['#0072E6', '#000000']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.slideContainer}>
          <Image
            source={slide}
            style={styles.slideImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.title}>Información de contacto</Text>

          <View style={styles.contactRow}>
            <Icon name="home" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.regulartext}>CARRETERA AL PUEBLITO KM. 2.5, Durango, México, 34188</Text>
          </View>

          <View style={styles.contactRow}>
            <Icon name="call" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.regulartext}>618 112 3792</Text>
          </View>

          <View style={styles.contactRow}>
            <Icon name="mail" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.regulartext}>realcantera09@gmail.com</Text>
          </View>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 23.977653550259653,
              longitude: -104.6862603021172,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{ latitude: 23.977653550259653, longitude: -104.6862603021172 }}
              title="Ubicación"
              description="Carretera al Pueblito KM. 2.5"
            />
          </MapView>

          {/* Imágenes agregadas debajo del mapa */}
          <Image
            source={{ uri: 'https://scontent.fgdl1-4.fna.fbcdn.net/v/t39.30808-6/501329334_1162817665650020_1119024762628499184_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=OAtqN_mNlLsQ7kNvwHNxS_u&_nc_oc=Adm1mPggK9UwTCAukhomw94ab1k5p11iV02_0CUw_YLRzbBhWvA7c5tzbsJCkVYoLBA&_nc_zt=23&_nc_ht=scontent.fgdl1-4.fna&_nc_gid=SD9IikcADPUYKVtrWhD72A&oh=00_AfS29PyhR1_kKhjHyK3VxgkGyye_VPy2Y5bfH5rmxRruHw&oe=68858BBF' }}
            style={styles.extraImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: 'https://scontent.fgdl1-4.fna.fbcdn.net/v/t39.30808-6/494268710_1151920263406427_3918560722729818492_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q1Euknt-zu4Q7kNvwFZeEQL&_nc_oc=AdkDg_8XXr3F5wHNOpRvHGuZKssmthPVe5DRI-tBsYAh65hYJWIicZYJGL7eFeBFitY&_nc_zt=23&_nc_ht=scontent.fgdl1-4.fna&_nc_gid=9xlLsQ5eK9TWZBRHMIDDHg&oh=00_AfQhKLTtxMF9LsXSFPUbPgai0ry_WdcOwJ-S1QMMuWakUg&oe=688596A9' }}
            style={styles.extraImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Public;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  slideContainer: {
    width: '100%',
    height: height * 0.25,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    marginTop: 20,
  },
  contactContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'flex-start',
    marginTop: 15,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 15,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 12,
  },
  regulartext: {
    color: '#fff',
    fontSize: 19,
    textAlign: 'left',
    flexShrink: 1,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 20,
  },
  extraImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 20,
  },
  menuContent: {
    backgroundColor: '#000',
    borderRadius: 8,
    marginTop: 40,
  },
  menuText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },
});
