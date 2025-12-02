export const round = (value: number, decimals = 1): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatTemperature = (temp: number): string => {
  return `${round(temp)}°C`;
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  return `${round(value)}%`;
};

export const formatSpeed = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  return `${round(value)} km/h`;
};

