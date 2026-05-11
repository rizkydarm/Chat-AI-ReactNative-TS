import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Switch, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '@/constants/theme';

export default function Settingpage() {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const SettingItem = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    showToggle = true 
  }: {
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    showToggle?: boolean;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: Colors.light.backgroundElement, true: Colors.light.backgroundSelected }}
          thumbColor={value ? Colors.light.text : Colors.light.textSecondary}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingItem
            title="Dark Mode"
            subtitle="Toggle dark mode theme"
            value={darkMode}
            onToggle={setDarkMode}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            title="Push Notifications"
            subtitle="Receive notifications for new messages"
            value={notifications}
            onToggle={setNotifications}
          />
          <SettingItem
            title="Sound Effects"
            subtitle="Play sounds for messages and actions"
            value={true}
            onToggle={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat Settings</Text>
          <SettingItem
            title="Auto-save Messages"
            subtitle="Automatically save chat history"
            value={autoSave}
            onToggle={setAutoSave}
          />
          <SettingItem
            title="Message Timestamps"
            subtitle="Show timestamps on messages"
            value={true}
            onToggle={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            title="Version"
            subtitle="1.0.0"
            showToggle={false}
          />
          <Pressable style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingSubtitle}>View our privacy policy</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingSubtitle}>View our terms of service</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundElement,
  },
  menuButton: {
    padding: Spacing.one,
  },
  menuIcon: {
    fontSize: 24,
    color: Colors.light.text,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
  },
  section: {
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.three,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundElement,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: Spacing.one,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: Colors.light.textSecondary,
  },
});
