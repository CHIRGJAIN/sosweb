import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import AdminHome from './src/screens/AdminHome';
import NGOsScreen from './src/screens/NGOsScreen';
import NGODetail from './src/screens/NGODetail';
import SocialPosts from './src/screens/SocialPostsScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import DistressMonitor from './src/screens/DistressMonitorScreen';
import ContributionsScreen from './src/screens/ContributionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={AdminHome} />
      <Tab.Screen name="NGOs" component={NGOsScreen} />
      <Tab.Screen name="Social" component={SocialPosts} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Distress" component={DistressMonitor} />
      <Tab.Screen name="Contribs" component={ContributionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="NGODetail" component={NGODetail} options={{ title: 'NGO Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
