import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/constants/theme';
import { weatherService } from '@/src/services/weather.service';
import { City, TableRow } from '@/src/types';
import { useWeather } from '@/src/context/WeatherContext';
import { useTableData } from '@/src/hooks/use-weather-data';
import { MIN_DATE, MAX_DATE, ITEMS_PER_PAGE, MIN_DATE_OBJ, MAX_DATE_OBJ } from '@/src/constants/dates';
import { formatDateShort, formatPercentage, formatSpeed } from '@/src/utils';

export function Table() {
  const [startDate, setStartDate] = useState(MIN_DATE);
  const [endDate, setEndDate] = useState(MAX_DATE);
  const [displayedData, setDisplayedData] = useState<TableRow[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const { selectedCity, setSelectedCity, loading, error, loadForecast } = useWeather();
  const allTableData = useTableData();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const cities = weatherService.getCities();

  const tableData = useMemo(() => {
    if (!allTableData.length) {
      return [];
    }
    
    const filtered = allTableData.filter((row) => {
      const rowDate = row.time.split('T')[0];
      return rowDate >= startDate && rowDate <= endDate;
    });
    
    return filtered;
  }, [allTableData, startDate, endDate]);

  useEffect(() => {
    if (tableData.length > 0) {
      setDisplayedData(tableData.slice(0, ITEMS_PER_PAGE));
    } else {
      setDisplayedData([]);
    }
  }, [tableData]);

  const validateDates = useCallback((start: string, end: string) => {
    let startDateObj = new Date(start);
    let endDateObj = new Date(end);
    let warning = '';

    if (startDateObj < MIN_DATE_OBJ) {
      warning += 'A data inicial foi ajustada para 31/08/2025. ';
      startDateObj = new Date(MIN_DATE_OBJ);
    }

    if (endDateObj > MAX_DATE_OBJ) {
      warning += 'A data final foi ajustada para 17/12/2025. ';
      endDateObj = new Date(MAX_DATE_OBJ);
    }

    if (startDateObj > endDateObj) {
      warning += 'Intervalo inválido. Intervalo ajustado automaticamente. ';
      startDateObj = new Date(MIN_DATE_OBJ);
      endDateObj = new Date(MAX_DATE_OBJ);
    }

    return {
      validStart: startDateObj.toISOString().split('T')[0],
      validEnd: endDateObj.toISOString().split('T')[0],
      warning,
    };
  }, []);

  useEffect(() => {
    const validation = validateDates(startDate, endDate);
    if (validation.warning) {
      setWarningMessage(validation.warning);
    } else {
      setWarningMessage('');
    }

    if (tableData.length === 0 && !loading && !error && allTableData.length > 0) {
      setWarningMessage('Nenhum dado encontrado para o período selecionado.');
    }
  }, [startDate, endDate, tableData.length, loading, error, allTableData.length, validateDates]);

  useEffect(() => {
    if (error) {
      setWarningMessage(error);
    }
  }, [error]);


  const handleStartDateChange = useCallback((event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setStartDate(dateStr);
      if (Platform.OS === 'ios') {
        setShowStartDatePicker(false);
      }
    }
  }, []);

  const handleEndDateChange = useCallback((event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setEndDate(dateStr);
      if (Platform.OS === 'ios') {
        setShowEndDatePicker(false);
      }
    }
  }, []);

  const handleCityChange = useCallback((city: City) => {
    setSelectedCity(city);
    setShowCityPicker(false);
  }, [setSelectedCity]);

  const loadMore = useCallback(() => {
    if (loadingMore || displayedData.length >= tableData.length) {
      return;
    }

    setLoadingMore(true);
    const currentLength = displayedData.length;
    const nextItems = tableData.slice(
      currentLength,
      currentLength + ITEMS_PER_PAGE
    );
    setDisplayedData([...displayedData, ...nextItems]);
    setLoadingMore(false);
  }, [displayedData, tableData, loadingMore]);

  const hasMoreData = displayedData.length < tableData.length;

  const showLoadMoreButton = !loading && tableData.length > 0 && hasMoreData;
  const showAllLoadedMessage = !loading && !hasMoreData && tableData.length > 0;

  const getTemperatureAriaLabel = (temp: number): string => {
    return `Temperatura: ${temp} graus Celsius`;
  };

  const getPrecipitationAriaLabel = (prec: number): string => {
    return `Probabilidade de precipitação: ${prec} por cento`;
  };

  const getHumidityAriaLabel = (hum: number | null): string => {
    if (hum === null || hum === undefined) {
      return 'Umidade não disponível';
    }
    return `Umidade: ${hum} por cento`;
  };

  const getWindSpeedAriaLabel = (wind: number | null): string => {
    if (wind === null || wind === undefined) {
      return 'Velocidade do vento não disponível';
    }
    return `Velocidade do vento: ${wind} quilômetros por hora`;
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Séries horárias</Text>
        <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
          Dados por hora para o intervalo e localização selecionados.
        </Text>
      </View>

      {warningMessage ? (
        <View
          style={[styles.warning, { backgroundColor: isDark ? '#2C2C2E' : '#FFF3CD', borderColor: isDark ? '#38383A' : '#FFC107' }]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite">
          <Text style={[styles.warningText, { color: isDark ? '#FF453A' : '#856404' }]}>
            {warningMessage}
          </Text>
        </View>
      ) : null}

      <View
        style={styles.filters}
        accessibilityLabel="Filtros de busca de dados meteorológicos">
        <View style={styles.filterField}>
          <Text style={[styles.label, { color: colors.text }]}>Data de Início</Text>
          <TouchableOpacity
            style={[
              styles.input,
              { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5', borderColor: isDark ? '#38383A' : '#E0E0E0' },
            ]}
            onPress={() => setShowStartDatePicker(true)}
            accessibilityLabel="Data de Início"
            accessibilityRole="button">
            <Text style={[styles.inputText, { color: colors.text }]}>{startDate}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterField}>
          <Text style={[styles.label, { color: colors.text }]}>Data de Fim</Text>
          <TouchableOpacity
            style={[
              styles.input,
              { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5', borderColor: isDark ? '#38383A' : '#E0E0E0' },
            ]}
            onPress={() => setShowEndDatePicker(true)}
            accessibilityLabel="Data de Fim"
            accessibilityRole="button">
            <Text style={[styles.inputText, { color: colors.text }]}>{endDate}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterField}>
          <Text style={[styles.label, { color: colors.text }]}>Cidade</Text>
          <TouchableOpacity
            style={[
              styles.input,
              { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5', borderColor: isDark ? '#38383A' : '#E0E0E0' },
            ]}
            onPress={() => setShowCityPicker(true)}
            accessibilityLabel="Cidade"
            accessibilityRole="button">
            <Text style={[styles.inputText, { color: colors.text }]}>
              {selectedCity?.name || 'Selecione uma cidade'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterAction}>
          <TouchableOpacity
            style={[
              styles.searchButton,
              { backgroundColor: isDark ? '#0a7ea4' : colors.tint },
              loading && { opacity: 0.6 }
            ]}
            onPress={async () => {
              if (selectedCity) {
                const validation = validateDates(startDate, endDate);
                const validStart = validation.validStart;
                const validEnd = validation.validEnd;
                
                if (validation.warning) {
                  setWarningMessage(validation.warning);
                  setStartDate(validStart);
                  setEndDate(validEnd);
                }
                
                await loadForecast(selectedCity, validStart, validEnd);
              }
            }}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Buscar dados meteorológicos">
            <Text style={styles.searchButtonText}>
              {loading ? 'Buscando...' : 'Buscar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && !tableData.length ? (
        <View
          style={styles.loading}
          accessibilityLiveRegion="polite"
          accessibilityLabel="Carregando dados">
          <ActivityIndicator size="small" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Carregando dados meteorológicos...
          </Text>
        </View>
      ) : !loading && displayedData.length > 0 ? (
        <View
          style={styles.tableRegion}
          accessibilityLabel="Tabela de dados meteorológicos">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tableWrapper}>
            <View>
              <View
                style={[styles.tableHeader, { borderBottomColor: isDark ? '#38383A' : '#E0E0E0' }]}>
                <Text style={[styles.headerCell, styles.timeCell, { color: colors.text }]} numberOfLines={1}>
                  Data
                </Text>
                <Text style={[styles.headerCell, { color: colors.text }]} numberOfLines={1}>
                  Temperatura (°C)
                </Text>
                <Text style={[styles.headerCell, { color: colors.text }]} numberOfLines={1}>Precip (%)</Text>
                <Text style={[styles.headerCell, { color: colors.text }]} numberOfLines={1}>Umidade</Text>
                <Text style={[styles.headerCell, { color: colors.text }]} numberOfLines={1}>Vento</Text>
              </View>
              <ScrollView style={styles.tableBody} accessibilityRole="none">
                {displayedData.map((row, index) => (
                  <View
                    key={row.id}
                    style={[
                      styles.tableRow,
                      { borderBottomColor: isDark ? '#38383A' : '#E0E0E0' },
                      index % 2 === 0 && {
                        backgroundColor: isDark ? '#1C1C1E' : '#F9F9F9',
                      },
                    ]}>
                    <Text
                      style={[styles.cell, styles.timeCell, { color: colors.text }]}
                      accessibilityLabel={formatDateShort(row.time)}
                      numberOfLines={1}>
                      {formatDateShort(row.time)}
                    </Text>
                    <Text
                      style={[styles.cell, { color: colors.text }]}
                      accessibilityLabel={getTemperatureAriaLabel(row.temp)}
                      numberOfLines={1}>
                      {row.temp}°C
                    </Text>
                    <Text
                      style={[styles.cell, { color: colors.text }]}
                      accessibilityLabel={getPrecipitationAriaLabel(row.prec)}
                      numberOfLines={1}>
                      {row.prec}%
                    </Text>
                    <Text
                      style={[styles.cell, { color: colors.text }]}
                      accessibilityLabel={getHumidityAriaLabel(row.hum)}
                      numberOfLines={1}>
                      {formatPercentage(row.hum)}
                    </Text>
                    <Text
                      style={[styles.cell, { color: colors.text }]}
                      accessibilityLabel={getWindSpeedAriaLabel(row.wind)}
                      numberOfLines={1}>
                      {formatSpeed(row.wind)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.empty} accessibilityLiveRegion="polite">
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            Nenhum dado disponível para os filtros selecionados.
          </Text>
        </View>
      )}

      {showLoadMoreButton ? (
        <View
          style={[styles.loadMoreContainer, { borderTopColor: isDark ? '#38383A' : '#E0E0E0' }]}>
          <TouchableOpacity
            style={[
              styles.loadMoreButton,
              { backgroundColor: isDark ? '#0a7ea4' : colors.tint }
            ]}
            onPress={loadMore}
            disabled={loadingMore}
            accessibilityRole="button"
            accessibilityLabel={`Carregar mais registros. Atualmente exibindo ${displayedData.length} de ${tableData.length} registros`}>
            {loadingMore ? (
              <Text style={styles.loadMoreButtonText}>Carregando...</Text>
            ) : (
              <Text style={styles.loadMoreButtonText}>Carregar mais</Text>
            )}
          </TouchableOpacity>
          <Text
            style={[styles.infoText, { color: colors.icon }]}
            accessibilityLiveRegion="polite">
            Exibindo {displayedData.length} de {tableData.length} registros
          </Text>
        </View>
      ) : null}

      {showAllLoadedMessage ? (
        <View
          style={[styles.allLoaded, { borderTopColor: isDark ? '#38383A' : '#E0E0E0' }]}
          accessibilityLiveRegion="polite">
          <Text style={[styles.allLoadedText, { color: colors.icon }]}>
            Todos os {tableData.length} registros estão sendo exibidos
          </Text>
        </View>
      ) : null}

      <Modal
        visible={showCityPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Selecione uma cidade</Text>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    { borderBottomColor: isDark ? '#38383A' : '#E0E0E0' },
                  ]}
                      onPress={() => handleCityChange(item)}>
                  <Text style={[styles.cityText, { color: colors.text }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
                    <TouchableOpacity
                      style={[
                        styles.closeButton,
                        { backgroundColor: isDark ? '#0a7ea4' : colors.tint }
                      ]}
                      onPress={() => setShowCityPicker(false)}>
                      <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showStartDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            visible={showStartDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowStartDatePicker(false)}>
            <View style={styles.datePickerModal}>
              <View style={[styles.datePickerContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
                <View style={[styles.datePickerHeader, { borderBottomColor: isDark ? '#38383A' : '#E0E0E0' }]}>
                  <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                    <Text style={[styles.datePickerButton, { color: isDark ? '#0a7ea4' : colors.tint }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <Text style={[styles.datePickerTitle, { color: colors.text }]}>Data de Início</Text>
                  <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                    <Text style={[styles.datePickerButton, { color: isDark ? '#0a7ea4' : colors.tint }]}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={startDate ? new Date(startDate + 'T00:00:00') : new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                  minimumDate={new Date(MIN_DATE)}
                  maximumDate={new Date(MAX_DATE)}
                  style={styles.datePicker}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={startDate ? new Date(startDate + 'T00:00:00') : new Date()}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            minimumDate={new Date(MIN_DATE)}
            maximumDate={new Date(MAX_DATE)}
          />
        )
      )}

      {showEndDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            visible={showEndDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEndDatePicker(false)}>
            <View style={styles.datePickerModal}>
              <View style={[styles.datePickerContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
                <View style={[styles.datePickerHeader, { borderBottomColor: isDark ? '#38383A' : '#E0E0E0' }]}>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text style={[styles.datePickerButton, { color: isDark ? '#0a7ea4' : colors.tint }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <Text style={[styles.datePickerTitle, { color: colors.text }]}>Data de Fim</Text>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text style={[styles.datePickerButton, { color: isDark ? '#0a7ea4' : colors.tint }]}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={endDate ? new Date(endDate + 'T00:00:00') : new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                  minimumDate={new Date(MIN_DATE)}
                  maximumDate={new Date(MAX_DATE)}
                  style={styles.datePicker}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={endDate ? new Date(endDate + 'T00:00:00') : new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={new Date(MIN_DATE)}
            maximumDate={new Date(MAX_DATE)}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    gap: 12,
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  warning: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 14,
  },
  filters: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 12,
    width: '100%',
  },
  filterField: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    minHeight: 40,
    fontSize: 14,
  },
  inputText: {
    fontSize: 14,
  },
  filterAction: {
    width: '100%',
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    width: '100%',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
  },
  tableRegion: {
    width: '100%',
  },
  tableWrapper: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    minWidth: 100,
    textAlign: 'left',
    flex: 0,
  },
  timeCell: {
    minWidth: 140,
    width: 140,
  },
  tableBody: {
    maxHeight: 350,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: {
    fontSize: 14,
    paddingHorizontal: 8,
    minWidth: 100,
    width: 100,
    textAlign: 'left',
    flex: 0,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadMoreContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    minHeight: 40,
  },
  loadMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    margin: 0,
  },
  allLoaded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  allLoadedText: {
    fontSize: 14,
    margin: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cityItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  cityText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  datePickerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
});
