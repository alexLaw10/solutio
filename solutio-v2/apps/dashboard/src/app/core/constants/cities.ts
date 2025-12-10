import { City } from '../interfaces/table.interfaces';

/**
 * Lista de cidades disponíveis no sistema
 */
export const CITIES: City[] = [
  { name: 'João Pessoa', lat: -7.1153, lng: -34.8641 },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { name: 'Brasília', lat: -15.7942, lng: -47.8822 },
];

/**
 * Cidade padrão selecionada
 */
export const DEFAULT_CITY = CITIES[0].name;
