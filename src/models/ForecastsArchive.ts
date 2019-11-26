import mongoose, { Schema } from 'mongoose';
import { ISpotRecentForecast } from './SpotRecentForecast';

// TODO trzeba cos z ta schema pkombinowac

export const ForecastsArchiveSchema: Schema = new Schema({
  spotName: { type: String, required: true, unique: false },
  spotUrlPart: { type: String, required: true, unique: false },
  timestamp: { type: Number, required: true, unique: false },
  forecasts: [
    {
      day: { type: String, required: true, unique: false },
      hours: [
        {
          windDirection: { type: String, required: false, unique: false },
          windSpeed: { type: String, required: true, unique: false },
          gusts: { type: String, required: true, unique: false },
          hour: { type: String, required: true, unique: false }
        }
      ]
    }
  ]
});

export default mongoose.model<ISpotRecentForecast>(
  'ForecastsArchive',
  ForecastsArchiveSchema
);
