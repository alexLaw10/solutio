import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/constants/theme';
import { useWeather } from '@/src/context/WeatherContext';
import { useAreaChartData } from '@/src/hooks/use-weather-data';

const screenWidth = Dimensions.get('window').width;

function AreaComponent() {
  const { loading, error } = useWeather();
  const chartData = useAreaChartData();

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
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: isDark ? '#FFFFFF' : '#000000',
    },
    fillShadowGradient: colors.tint,
    fillShadowGradientOpacity: 0.3,
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
        <Text style={[styles.title, { color: colors.text }]}>Série Temporal de Temperatura</Text>
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
        <Text style={[styles.title, { color: colors.text }]}>Série Temporal de Temperatura</Text>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.icon }]}>
            Nenhum dado disponível para exibir o gráfico.
          </Text>
        </View>
      </View>
    );
  }

  const displayLabels = chartData.labels.length > 10 
    ? chartData.labels.filter((_, index) => index % Math.ceil(chartData.labels.length / 10) === 0)
    : chartData.labels;

  const displayData = chartData.datasets.data.length > 10
    ? chartData.datasets.data.filter((_, index) => index % Math.ceil(chartData.datasets.data.length / 10) === 0)
    : chartData.datasets.data;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Série Temporal de Temperatura</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Evolução da temperatura ao longo do tempo em gráfico de área.
      </Text>
      <LineChart
        data={{
          labels: displayLabels,
          datasets: [
            {
              data: displayData,
              color: (opacity = 1) => colors.tint,
              strokeWidth: 2,
            },
          ],
        }}
        width={Math.max(screenWidth - 48, 300)}
        height={220}
        yAxisLabel=""
        yAxisSuffix="°C"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withShadow={true}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
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

export const Area = React.memo(AreaComponent);

