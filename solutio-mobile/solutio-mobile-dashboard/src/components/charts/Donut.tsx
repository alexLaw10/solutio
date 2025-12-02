import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/constants/theme';
import { useWeather } from '@/src/context/WeatherContext';
import { useDonutChartData } from '@/src/hooks/use-weather-data';
import { APP_CONFIG } from '@/src/config';

const screenWidth = Dimensions.get('window').width;

function DonutComponent() {
  const { loading, error } = useWeather();
  const chartData = useDonutChartData();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const chartConfig = useMemo(() => ({
    backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    backgroundGradientFrom: isDark ? '#1C1C1E' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1C1C1E' : '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  }), [isDark]);

  const pieData = useMemo(() => {
    if (!chartData) return null;
    return [
    {
      name: `Temperatura Atual (${chartData.current}°C)`,
      population: chartData.current,
      color: colors.tint,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: `Restante até ${APP_CONFIG.donutMaxTemp}°C (${chartData.remaining}°C)`,
      population: chartData.remaining,
      color: isDark ? '#38383A' : '#E0E0E0',
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    ];
  }, [chartData, colors.tint, colors.text, isDark]);

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
        <Text style={[styles.title, { color: colors.text }]}>Temperatura Atual</Text>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.icon }]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!chartData || !pieData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Temperatura Atual</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        {`Distribuição da temperatura atual em relação ao máximo de ${APP_CONFIG.donutMaxTemp}°C.`}
      </Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          width={Math.max(screenWidth - 48, 300)}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          absolute
        />
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
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export const Donut = React.memo(DonutComponent);

