import { WindDirections } from '../enums';

export interface MinimalForecast {
  direction: WindDirections[];
  minWindSpeed: number;
}
