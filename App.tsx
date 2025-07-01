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
    <CopilotProvider
      tooltipComponent={undefined} // You can add custom tooltip component here
      tooltipStyle={{
        backgroundColor: '#c8c8c8',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      arrowColor="#1C1C1E"
      overlay="svg" // Use SVG overlay for better performance
      animated={true} // Enable animations
      labels={{
        previous: 'Back',
        next: 'Next',
        skip: 'Skip Tour',
        finish: 'Got it!',
      }}
    >
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