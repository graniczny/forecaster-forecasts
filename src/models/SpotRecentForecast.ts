import mongoose, { Schema, Document } from 'mongoose';

import { DayForecast } from '../interfaces';

export interface ISpotRecentForecast extends Document {
  spotName: string;
  spotUrlPart: string;
  timestamp: number;
  forecasts: DayForecast[];
}

// TODO co zrobić z HourForecast, jakos scheme dodać gdzies?
const SpotRecentForecastSchema: Schema = new Schema({
  spotName: { type: String, required: true, unique: true },
  spotUrlPart: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true, unique: false },
  forecasts: [
    {
      day: { type: String, required: true, unique: false },
      hours: [
        {
          windDirection: { type: String, required: true, unique: false },
          windSpeed: { type: String, required: true, unique: false },
          gusts: { type: String, required: true, unique: false },
          hour: { type: String, required: true, unique: false }
        }
      ]
    }
  ]
});

export default mongoose.model<ISpotRecentForecast>(
  'SpotRecentForecast',
  SpotRecentForecastSchema
);
