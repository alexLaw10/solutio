"""
Serializers para validação de dados de entrada
"""
from rest_framework import serializers


class ForecastRequestSerializer(serializers.Serializer):
    """Serializer para validação de requisição de forecast"""
    lat = serializers.FloatField(
        required=True,
        min_value=-90,
        max_value=90,
        help_text="Latitude (-90 a 90)"
    )
    lon = serializers.FloatField(
        required=True,
        min_value=-180,
        max_value=180,
        help_text="Longitude (-180 a 180)"
    )


class HistoricalWeatherRequestSerializer(serializers.Serializer):
    """Serializer para validação de requisição de dados históricos"""
    lat = serializers.FloatField(
        required=True,
        min_value=-90,
        max_value=90,
        help_text="Latitude (-90 a 90)"
    )
    lon = serializers.FloatField(
        required=True,
        min_value=-180,
        max_value=180,
        help_text="Longitude (-180 a 180)"
    )
    start_date = serializers.DateField(
        required=True,
        help_text="Data inicial (YYYY-MM-DD)"
    )
    end_date = serializers.DateField(
        required=True,
        help_text="Data final (YYYY-MM-DD)"
    )
