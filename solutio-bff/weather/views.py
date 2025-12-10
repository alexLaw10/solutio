"""
Views para endpoints de weather
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .services import OpenMeteoService, WeatherDataFilter
from .serializers import ForecastRequestSerializer, HistoricalWeatherRequestSerializer


class ForecastView(APIView):
    """
    Endpoint para buscar dados de previsão do tempo
    
    GET /api/weather/forecast/?lat=-7.1153&lon=-34.8641
    
    Retorna apenas os campos utilizados pela aplicação frontend:
    - current_weather: temperatura atual
    - hourly: time, temperature_2m, precipitation_probability, 
              relative_humidity_2m, windspeed_10m, weathercode
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = ForecastRequestSerializer(data=request.query_params)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Parâmetros inválidos', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lat = serializer.validated_data['lat']
        lon = serializer.validated_data['lon']
        
        # Busca dados do Open-Meteo
        raw_data = OpenMeteoService.get_forecast(lat, lon)
        
        if not raw_data:
            return Response(
                {'error': 'Erro ao buscar dados meteorológicos'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        # Filtra dados retornando apenas o que a aplicação usa
        filtered_data = WeatherDataFilter.filter_forecast_data(raw_data)
        
        return Response(filtered_data, status=status.HTTP_200_OK)


class HistoricalWeatherView(APIView):
    """
    Endpoint para buscar dados históricos do tempo
    
    GET /api/weather/historical/?lat=-7.1153&lon=-34.8641&start_date=2024-01-01&end_date=2024-01-31
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = HistoricalWeatherRequestSerializer(data=request.query_params)
        
        if not serializer.is_valid():
            return Response(
                {'error': 'Parâmetros inválidos', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lat = serializer.validated_data['lat']
        lon = serializer.validated_data['lon']
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        
        # Busca dados históricos do Open-Meteo
        raw_data = OpenMeteoService.get_historical_weather(
            lat, lon, 
            start_date.strftime('%Y-%m-%d'),
            end_date.strftime('%Y-%m-%d')
        )
        
        if not raw_data:
            return Response(
                {'error': 'Erro ao buscar dados históricos'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        # Filtra dados retornando apenas o que a aplicação usa
        filtered_data = WeatherDataFilter.filter_forecast_data(raw_data)
        
        return Response(filtered_data, status=status.HTTP_200_OK)
