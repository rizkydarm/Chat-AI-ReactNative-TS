import React from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '@/constants/theme';

export default function Homepage() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Chat AI</Text>
          <Text style={styles.subtitle}>Your intelligent conversation companion</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Chatpage' as never)}>
            <Text style={styles.buttonText}>Start Chat</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Settingpage' as never)}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Settings</Text>
          </Pressable>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Intelligent AI responses</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Fast and reliable</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Easy to use interface</Text>
          </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: Spacing.three,
    marginBottom: Spacing.six,
  },
  button: {
    backgroundColor: Colors.light.backgroundElement,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.six,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
  },
  buttonText: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: Colors.light.backgroundElement,
  },
  features: {
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.four,
  },
  featureItem: {
    marginBottom: Spacing.two,
  },
  featureText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
});
