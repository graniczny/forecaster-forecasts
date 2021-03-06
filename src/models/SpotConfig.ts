import mongoose, { Schema, Document } from 'mongoose';

import { MinimalForecast } from '../interfaces';
import { WindDirections, SpotTypes, Countries } from '../enums';

export interface ISpotConfig extends Document {
  id: string;
  spotName: string;
  spotUrlPart: string;
  country: Countries;
  windDirections?: WindDirections[];
  spotType?: SpotTypes[];
  minimalForecast?: MinimalForecast[];
}

const SpotConfigSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  spotName: { type: String, required: true, unique: true },
  spotUrlPart: { type: String, required: true, unique: true },
  country: { type: String, enum: Object.keys(Countries), required: true },
  windDirections: [
    {
      type: String,
      enum: Object.keys(WindDirections),
      required: false
    }
  ],
  spotType: { type: String, enum: Object.keys(SpotTypes), required: false },
  minimalForecast: [
    {
      direction: [
        {
          type: String,
          enum: Object.keys(WindDirections),
          required: true
        }
      ],
      minWindSpeed: { type: Number, required: true }
    }
  ]
});

export default mongoose.model<ISpotConfig>('SpotConfig', SpotConfigSchema);
