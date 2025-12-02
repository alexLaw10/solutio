import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/constants/theme';
import { useWeather } from '@/src/context/WeatherContext';
import { useBarChartData } from '@/src/hooks/use-weather-data';

const screenWidth = Dimensions.get('window').width;

function BarComponent() {
  const { loading, error } = useWeather();
  const chartData = useBarChartData();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const chartConfig = useMemo(() => ({
    backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    backgroundGradientFrom: isDark ? '#1C1C1E' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1C1C1E' : '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => colors.tint,
    labelColor: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  }), [isDark, colors.tint]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Carregando gráfico...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Temperatura Média Diária</Text>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.icon }]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!chartData || chartData.labels.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Temperatura Média Diária</Text>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.icon }]}>
            Nenhum dado disponível para exibir o gráfico.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Temperatura Média Diária</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Gráfico de barras com a temperatura média por dia.
      </Text>
      <BarChart
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.datasets.data,
            },
          ],
        }}
        width={Math.max(screenWidth - 48, 300)}
        height={220}
        yAxisLabel=""
        yAxisSuffix="°C"
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
      />
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export const Bar = React.memo(BarComponent);

