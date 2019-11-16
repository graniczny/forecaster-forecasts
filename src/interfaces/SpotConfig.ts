import { WindDirections, SpotTypes } from '../enums';

export interface SpotConfig {
  spotUrlPart: string;
  windDirections?: WindDirections[];
  spotType?: SpotTypes[];
}
