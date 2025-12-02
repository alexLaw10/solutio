import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/constants/theme';
import { useWeather } from '@/src/context/WeatherContext';
import { useKpiData } from '@/src/hooks/use-weather-data';

function KpiComponent() {
  const { loading, error } = useWeather();
  const kpiData = useKpiData();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Carregando indicadores...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Indicadores</Text>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.icon }]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!kpiData) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityLabel="Indicadores de temperatura">
      <Text style={[styles.title, { color: colors.text }]}>Indicadores</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Métricas de temperatura da localização selecionada.
      </Text>
      <View style={styles.cardsContainer}>
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F9F9F9', borderColor: isDark ? '#38383A' : '#E0E0E0' },
          ]}
          accessibilityLabel={`Temperatura média: ${kpiData.avgTemp} graus Celsius`}>
          <Text style={[styles.cardLabel, { color: colors.icon }]}>Média</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{kpiData.avgTemp} °C</Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F9F9F9', borderColor: isDark ? '#38383A' : '#E0E0E0' },
          ]}
          accessibilityLabel={`Temperatura máxima: ${kpiData.maxTemp} graus Celsius`}>
          <Text style={[styles.cardLabel, { color: colors.icon }]}>Máximo</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{kpiData.maxTemp} °C</Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F9F9F9', borderColor: isDark ? '#38383A' : '#E0E0E0' },
          ]}
          accessibilityLabel={`Temperatura mínima: ${kpiData.minTemp} graus Celsius`}>
          <Text style={[styles.cardLabel, { color: colors.icon }]}>Mínimo</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{kpiData.minTemp} °C</Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F9F9F9', borderColor: isDark ? '#38383A' : '#E0E0E0' },
          ]}
          accessibilityLabel={`Variação percentual: ${kpiData.percentChange} por cento`}>
          <Text style={[styles.cardLabel, { color: colors.icon }]}>Variação (%)</Text>
          <Text
            style={[
              styles.cardValue,
              { color: kpiData.percentChange >= 0 ? '#28A745' : '#DC3545' },
            ]}>
            {kpiData.percentChange}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export const Kpi = React.memo(KpiComponent);

