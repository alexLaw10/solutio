"""
URLs do app weather
"""
from django.urls import path
from . import views

app_name = 'weather'

urlpatterns = [
    path('weather/forecast/', views.ForecastView.as_view(), name='forecast'),
    path('weather/historical/', views.HistoricalWeatherView.as_view(), name='historical'),
]
