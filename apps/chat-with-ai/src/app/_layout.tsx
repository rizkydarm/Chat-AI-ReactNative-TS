import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/src/global.css';

export default function RootLayout() {
  return (
    
    <GluestackUIProvider mode="dark">
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen 
          name="index" 
          options={{ 
            drawerLabel: 'Home',
            title: 'Home'
          }} 
        />
        <Drawer.Screen 
          name="settings" 
          options={{ 
            drawerLabel: 'Settings',
            title: 'Settings'
          }} 
        />
        <Drawer.Screen 
          name="detail" 
          options={{ 
            drawerLabel: 'Detail',
            title: 'Detail'
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
    </GluestackUIProvider>
  
  );
}
