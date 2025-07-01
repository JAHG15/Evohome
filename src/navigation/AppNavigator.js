import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import Public from '../screens/Public';
import Reservations from '../screens/Reservations';
import Team from '../screens/Team';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerScreens = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1e1e1e',
      },
      headerTintColor: '#fff',
      drawerStyle: {
        backgroundColor: '#121212',
        width: 250,
      },
      drawerLabelStyle: {
        fontSize: 16,
        fontWeight: '600',
      },
      drawerActiveTintColor: '#9b59b6',
      drawerInactiveTintColor: '#bbb',
    }}
  >
    <Drawer.Screen name="Home" component={Home} />
  </Drawer.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Public"
    screenOptions={{
      headerStyle: { backgroundColor: '#0072E6' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="Public" component={Public} options={{ title: '' }} />
    <Stack.Screen name="Login" component={Login} options={{ title: 'Iniciar sesión' }} />
    <Stack.Screen name="MainDrawer" component={DrawerScreens} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <Stack.Screen name="Reservations" component={Reservations} options={{ title: 'Reservaciones' }} />
    <Stack.Screen name="Team" component={Team} options={{ title: 'Equipo' }} />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{ title: 'Perfil', headerStyle: { backgroundColor: '#0072E6' } }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
