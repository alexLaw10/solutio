import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ThemedView } from '@/src/components/common/themed-view';
import { Table } from '@/src/components/common/Table';
import { Donut } from '@/src/components/charts/Donut';
import { Kpi } from '@/src/components/common/Kpi';
import { Bar } from '@/src/components/charts/Bar';
import { Area } from '@/src/components/charts/Area';
import { Alert } from '@/src/components/common/Alert';
import { useWeather } from '@/src/context/WeatherContext';
import { Colors } from '@/src/constants/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { refreshData } = useWeather();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      // Erro já é tratado pelo WeatherContext e exibido no Alert
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
              colors={[colors.tint]}
            />
          }>
          <Alert />
          <Table />
          <Donut />
          <Kpi />
          <Bar />
          <Area />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});
