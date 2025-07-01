// App.js
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler'; // debe ir primero siempre
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
