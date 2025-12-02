export interface OpenMeteoForecastRoot {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  hourly: OpenMeteoForecastHourly;
  daily: OpenMeteoForecastDaily;
  current_weather: OpenMeteoForecastCurrentWeather;
}

export interface OpenMeteoForecastHourly {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  relative_humidity_2m?: number[];
  windspeed_10m?: number[];
  weathercode?: number[];
}

export interface OpenMeteoForecastDaily {
  time: string[];
  weathercode: number[];
}

export interface OpenMeteoForecastCurrentWeather {
  time: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface OpenMeteoGfsRoot {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  hourly: OpenMeteoGfsHourly;
}

export interface OpenMeteoGfsHourly {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weathercode: number[];
}

export interface OpenMeteoGemRoot {
  latitude: number;
  longitude: number;
  hourly: OpenMeteoGemHourly;
}

export interface OpenMeteoGemHourly {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
}

export interface OpenMeteoEcmwfRoot {
  latitude: number;
  longitude: number;
  hourly: OpenMeteoEcmwfHourly;
}

export interface OpenMeteoEcmwfHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weathercode: number[];
}

export interface OpenMeteoClimateRoot {
  latitude: number;
  longitude: number;
  models: string[];
  data: OpenMeteoClimateModelData[];
}

export interface OpenMeteoClimateModelData {
  model: string;
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
}

export interface OpenMeteoHistoricalRoot {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    precipitation: string;
    relativehumidity_2m: string;
    windspeed_10m: string;
  };
  hourly: OpenMeteoHistoricalHourly;
}

export interface OpenMeteoHistoricalHourly {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  relativehumidity_2m: number[];
  windspeed_10m: number[];
}
