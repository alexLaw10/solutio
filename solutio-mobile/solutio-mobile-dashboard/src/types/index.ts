export type City = {
  name: string;
  lat: number;
  lng: number;
};

export type ForecastData = {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    relative_humidity_2m?: number[];
    windspeed_10m?: number[];
    weathercode?: number[];
  };
  current_weather?: {
    temperature: number;
    weathercode: number;
  };
};

export type KpiData = {
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  percentChange: number;
};

export type TableRow = {
  id: string;
  time: string;
  temp: number;
  prec: number;
  hum: number | null;
  wind: number | null;
  weathercode: number | null;
};

