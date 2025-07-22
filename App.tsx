import React, { useEffect } from 'react'
import {NavigationContainer , DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaymentScreen from './src/screens/PaymentScreen'
import DetailsScreen from './src/screens/DetailsScreen'
import TabNavigators from './src/navigators/TabNavigators';
import { CopilotProvider } from "react-native-copilot";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTooltip from './src/components/CustomTooltip';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { AppDarkTheme, AppLightTheme } from './src/theme/appThemes';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';



const Stack = createNativeStackNavigator();

const App = () => {

  const scheme = useColorScheme(); // returns 'dark' or 'light'

  const paperTheme = scheme === 'dark' ? AppDarkTheme : AppLightTheme;
  const navTheme = scheme === 'dark' ? NavDarkTheme : NavDefaultTheme;

  //  useEffect(() => {
  //   const resetTour = async () => {
  //     await AsyncStorage.removeItem('hasSeenTour'); // Remove this line in production
  //   };
  //   resetTour();
  // }, []);

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
      <PaperProvider theme={paperTheme}>
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
      </PaperProvider>
    </CopilotProvider>
  )
}

export default App