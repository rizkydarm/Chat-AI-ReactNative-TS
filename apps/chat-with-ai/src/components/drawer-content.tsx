import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Colors, Spacing } from '@/constants/theme';

interface DrawerContentProps {
  navigation: any;
  state: any;
}

export default function DrawerContent(props: DrawerContentProps) {
  const { navigation, state } = props;

  const menuItems = [
    {
      label: 'Home',
      icon: '🏠',
      target: 'Homepage',
    },
    {
      label: 'Chat',
      icon: '💬',
      target: 'Chatpage',
    },
    {
      label: 'Settings',
      icon: '⚙️',
      target: 'Settingpage',
    },
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>AI</Text>
          </View>
          <Text style={styles.appName}>Chat AI</Text>
        </View>
        <Text style={styles.subtitle}>Your AI Assistant</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <DrawerItem
            key={index}
            label={() => (
              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
            )}
            focused={state.routeNames[state.index] === item.target}
            onPress={() => navigation.navigate(item.target)}
            style={[
              styles.drawerItem,
              state.routeNames[state.index] === item.target && styles.activeItem,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerSubtitle}>© 2026 Chat AI</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundElement,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  menuContainer: {
    flex: 1,
    paddingTop: Spacing.two,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.three,
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  drawerItem: {
    marginHorizontal: Spacing.two,
    marginVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  activeItem: {
    backgroundColor: Colors.light.backgroundSelected,
  },
  footer: {
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.light.backgroundElement,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.one,
  },
  footerSubtitle: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
});
