import { apiService } from '../api.service';
import { APP_CONFIG } from '@/src/config';

global.fetch = jest.fn();

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('getForecast', () => {
    it('should fetch forecast without dates', async () => {
      const mockResponse = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-01-01T00:00'],
          temperature_2m: [20],
          precipitation_probability: [0],
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.getForecast(-7.1153, -34.8641);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should fetch forecast with dates', async () => {
      const mockResponse = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-09-01T00:00'],
          temperature_2m: [20],
          precipitation_probability: [0],
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.getForecast(
        -7.1153,
        -34.8641,
        '2025-09-01',
        '2025-09-02'
      );
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('start_date=2025-09-01'),
        expect.any(Object)
      );
    });

    it('should validate and adjust dates outside range', async () => {
      const mockResponse = {
        latitude: -7.1153,
        longitude: -34.8641,
        hourly: {
          time: ['2025-08-31T00:00'],
          temperature_2m: [20],
          precipitation_probability: [0],
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiService.getForecast(-7.1153, -34.8641, '2025-08-28', '2025-12-20');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('start_date=2025-08-31'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('end_date=2025-12-17'),
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ reason: 'Invalid parameters' }),
      });

      await expect(
        apiService.getForecast(-7.1153, -34.8641)
      ).rejects.toThrow('Invalid parameters');
    });

    it('should handle timeout', async () => {
      (fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              const abortError = new Error('AbortError');
              abortError.name = 'AbortError';
              throw abortError;
            }, APP_CONFIG.timeout + 1000);
          })
      );

      jest.advanceTimersByTime(APP_CONFIG.timeout);

      await expect(
        apiService.getForecast(-7.1153, -34.8641)
      ).rejects.toThrow('A requisição excedeu o tempo limite.');
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        apiService.getForecast(-7.1153, -34.8641)
      ).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(
        apiService.getForecast(-7.1153, -34.8641)
      ).rejects.toThrow('Erro ao buscar dados meteorológicos');
    });
  });
});

