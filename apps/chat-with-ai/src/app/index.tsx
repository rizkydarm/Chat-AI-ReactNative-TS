import { View, Text, Button, StyleSheet } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Text style={styles.description}>Welcome to the home screen</Text>
      <Button 
        title="Open Drawer" 
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});
