"""
Serviço para integração com a API Open-Meteo
"""
import requests
from typing import Dict, Optional, Any
from django.conf import settings


class OpenMeteoService:
    """Serviço para buscar dados da API Open-Meteo"""
    
    BASE_URL = settings.OPEN_METEO_BASE_URL
    
    @classmethod
    def get_forecast(cls, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """
        Busca dados de previsão do tempo
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Dicionário com dados de previsão ou None em caso de erro
        """
        url = f"{cls.BASE_URL}/v1/forecast"
        params = {
            'latitude': lat,
            'longitude': lon,
            'hourly': 'temperature_2m,precipitation_probability,relative_humidity_2m,windspeed_10m,weathercode',
            'daily': 'weathercode',
            'current_weather': 'true',
            'timezone': 'auto'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro ao buscar dados do Open-Meteo: {e}")
            return None
    
    @classmethod
    def get_historical_weather(
        cls, 
        lat: float, 
        lon: float, 
        start_date: str, 
        end_date: str
    ) -> Optional[Dict[str, Any]]:
        """
        Busca dados históricos do tempo
        
        Args:
            lat: Latitude
            lon: Longitude
            start_date: Data inicial (YYYY-MM-DD)
            end_date: Data final (YYYY-MM-DD)
            
        Returns:
            Dicionário com dados históricos ou None em caso de erro
        """
        url = f"{cls.BASE_URL}/v1/forecast"
        params = {
            'latitude': lat,
            'longitude': lon,
            'start_date': start_date,
            'end_date': end_date,
            'hourly': 'temperature_2m,precipitation,relativehumidity_2m,windspeed_10m',
            'timezone': 'auto'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro ao buscar dados históricos do Open-Meteo: {e}")
            return None


class WeatherDataFilter:
    """Classe para filtrar e formatar dados do Open-Meteo"""
    
    @staticmethod
    def filter_forecast_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Filtra os dados do forecast retornando apenas o que a aplicação usa
        
        Campos retornados:
        - current_weather: temperatura atual
        - hourly: time, temperature_2m, precipitation_probability, 
                  relative_humidity_2m, windspeed_10m, weathercode
        
        Args:
            raw_data: Dados brutos da API Open-Meteo
            
        Returns:
            Dicionário com dados filtrados
        """
        if not raw_data:
            return {}
        
        filtered = {
            'latitude': raw_data.get('latitude'),
            'longitude': raw_data.get('longitude'),
            'timezone': raw_data.get('timezone'),
        }
        
        # Current weather - apenas temperatura
        current_weather = raw_data.get('current_weather', {})
        if current_weather:
            filtered['current_weather'] = {
                'temperature': current_weather.get('temperature'),
                'time': current_weather.get('time'),
                'weathercode': current_weather.get('weathercode'),
            }
        
        # Hourly data - apenas campos usados
        hourly = raw_data.get('hourly', {})
        if hourly:
            filtered['hourly'] = {
                'time': hourly.get('time', []),
                'temperature_2m': hourly.get('temperature_2m', []),
                'precipitation_probability': hourly.get('precipitation_probability', []),
                'relative_humidity_2m': hourly.get('relative_humidity_2m'),
                'windspeed_10m': hourly.get('windspeed_10m'),
                'weathercode': hourly.get('weathercode'),
            }
        
        # Daily data - apenas weathercode se existir
        daily = raw_data.get('daily', {})
        if daily:
            filtered['daily'] = {
                'time': daily.get('time', []),
                'weathercode': daily.get('weathercode', []),
            }
        
        return filtered
