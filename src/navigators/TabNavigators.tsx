import React, { useEffect } from 'react';
import {StyleSheet , View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../theme/theme';
import {BlurView} from '@react-native-community/blur';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import CustomIcon from '../components/CustomIcon';
import {
  CopilotStep,
  walkthroughable,
  useCopilot,
} from 'react-native-copilot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator();
const CopilotView = walkthroughable(View);

const TabNavigator = () => {
  const { start, copilotEvents  } = useCopilot();
  const theme = useTheme(); 

  useEffect(() => {
    const handleStart = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenTour');
        if (!hasSeen) {
          await start();
          await AsyncStorage.setItem('hasSeenTour', 'true');
        }
      } catch (err) {
        console.error(err);
      }
    };

    copilotEvents.on('start', handleStart);
    
    // Start the tour after a short delay
    const timer = setTimeout(() => {
      handleStart();
    }, 1000);

    return () => {
      copilotEvents.off('start', handleStart);
      clearTimeout(timer);
    };
  }, [start, copilotEvents]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        // tabBarStyle: styles.tabBarStyle,
        tabBarStyle: [
          styles.tabBarStyle,
          {
            backgroundColor: theme.colors.elevation.level0, // ✅ dynamic background
          },
        ],
        tabBarBackground: () => (
          <BlurView
            overlayColor=""
            blurAmount={15}
            style={styles.BlurViewStyles}
          />
        ), 
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <CustomIcon
              name="home"
              size={25}
              color={
                focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
              }
            />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <CopilotStep 
  text={`🛒 Your Shopping Cart\n\n• View selected coffee items\n• Adjust quantities easily\n• Proceed to secure checkout!`} 
  order={5} 
  name="cart"
>

              <CopilotView>
                <CustomIcon
                  name="cart"
                  size={25}
                  color={
                    focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                  }
                />
              </CopilotView>
            </CopilotStep>
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Favorite"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <CopilotStep 
  text={`❤️ Your Favorites\n\n• Save your most loved coffees\n• Access them quickly anytime\n• Keep track of your perfect brews!`} 
  order={6} 
  name="favourite"
>

              <CopilotView>
                <CustomIcon
                  name="like"
                  size={25}
                  color={
                    focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                  }
                />
              </CopilotView>
            </CopilotStep>
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="History"
        component={OrderHistoryScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <CopilotStep 
  text={`📋 Order History\n\n• Track all your previous orders\n• Reorder your favorites\n• Manage your history easily`} 
  order={7} 
  name="History"
>
              <CopilotView>
                <CustomIcon
                  name="bell"
                  size={25}
                  color={
                    focused ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
                  }
                />
              </CopilotView>
            </CopilotStep>
          ),
        }}></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: 'absolute',
    backgroundColor: COLORS.primaryBlackRGBA,
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
  },
  BlurViewStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabNavigator;