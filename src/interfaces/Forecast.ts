export interface Forecast {
  windKts: number;
  gustKts: number;
  windDirection: number;
  waveHeight?: number;
  waveDirection?: number;
  cloudCover?: number;
}
