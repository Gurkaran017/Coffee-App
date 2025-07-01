import React, { useEffect } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaymentScreen from './src/screens/PaymentScreen'
import DetailsScreen from './src/screens/DetailsScreen'
import TabNavigators from './src/navigators/TabNavigators';
import { CopilotProvider } from "react-native-copilot";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

const App = () => {

   useEffect(() => {
    const resetTour = async () => {
      await AsyncStorage.removeItem('hasSeenTour'); // Remove this line in production
    };
    resetTour();
  }, []);

  return (
    <CopilotProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
        name="Tab"
        component={TabNavigators}
        options={{animation: "slide_from_bottom"}}
        ></Stack.Screen>

        <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{animation: "slide_from_bottom"}}
        ></Stack.Screen>

        <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{animation: "slide_from_bottom"}}
        ></Stack.Screen>
        
      </Stack.Navigator>
    </NavigationContainer>
    </CopilotProvider>
  )
}

export default App