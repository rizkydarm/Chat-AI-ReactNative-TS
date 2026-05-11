import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useColorScheme } from 'react-native';

import Homepage from './homepage';
import Chatpage from './chatpage';
import Settingpage from './settingpage';
import DrawerContent from '@/components/drawer-content';

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerPosition: 'left',
        }}>
        <Drawer.Screen name="Homepage" component={Homepage} />
        <Drawer.Screen name="Chatpage" component={Chatpage} />
        <Drawer.Screen name="Settingpage" component={Settingpage} />
      </Drawer.Navigator>
    </ThemeProvider>
  );
}
