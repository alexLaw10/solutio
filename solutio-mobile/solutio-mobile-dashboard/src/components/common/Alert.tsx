import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWeather } from '@/src/context/WeatherContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/constants/theme';

export function Alert() {
  const { error, setError } = useWeather();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  if (!error) {
    return null;
  }

  const handleClose = () => {
    setError(null);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#2C2C2E' : '#FFF3CD',
          borderColor: isDark ? '#38383A' : '#FFC107',
        },
      ]}
      role="alert"
      accessibilityLiveRegion="assertive">
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={[styles.title, { color: isDark ? '#FF453A' : '#856404' }]}>
            Erro na requisição
          </Text>
          <Text style={[styles.description, { color: isDark ? '#FF453A' : '#856404' }]}>
            {error}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          accessibilityLabel="Fechar alerta"
          accessibilityRole="button">
          <Text style={[styles.closeIcon, { color: isDark ? '#FF453A' : '#856404' }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  icon: {
    fontSize: 20,
  },
  messageContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
    marginTop: -4,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

