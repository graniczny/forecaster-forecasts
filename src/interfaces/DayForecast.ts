import { HourForecast } from './';

export interface DayForecast {
  day: string;
  hours: HourForecast[];
}
