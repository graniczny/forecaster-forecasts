import { DayForecast } from './';

export interface PeriodForecast {
  spotName: string;
  spotUrlPart: string;
  timestamp: number;
  forecasts: DayForecast[];
}
