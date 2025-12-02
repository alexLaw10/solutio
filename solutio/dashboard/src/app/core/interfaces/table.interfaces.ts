export interface TableRow {
  id: string;
  time: string;
  temp: number;
  prec: number;
  hum: number | null;
  wind: number | null;
  weathercode: number | null;
}

export interface City {
  name: string;
  lat: number;
  lng: number;
}

