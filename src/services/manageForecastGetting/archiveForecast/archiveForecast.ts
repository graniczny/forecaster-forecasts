import SpotRecentForecast, {
  ISpotRecentForecast
} from '../../../models/SpotRecentForecast';

import ForecastsArchive from '../../../models/ForecastsArchive';

export default async function archiveForecast(
  spotUrlPart: string
): Promise<boolean> {
  let recentForecast: Partial<ISpotRecentForecast>;
  try {
    recentForecast = await SpotRecentForecast.findOne(
      { spotUrlPart },
      {
        _id: false,
        __v: false,
        'forecasts._id': false,
        'forecasts.hours._id': false
      }
    )
      .lean()
      .exec();
  } catch (err) {
    throw new Error(
      `Error while getting recent forecast for ${spotUrlPart}, error: ${err}`
    );
  }

  if (!recentForecast) {
    return true;
  }
  const { spotName, timestamp, lastUpdateHour, forecasts } = recentForecast;
  const archiveForecast: Partial<ISpotRecentForecast> = {
    spotName,
    spotUrlPart,
    timestamp,
    lastUpdateHour,
    forecasts
  };
  const newArchivedForecast = new ForecastsArchive(archiveForecast);
  try {
    await newArchivedForecast.save();
  } catch (err) {
    throw new Error(
      `Error while saving forecast in archive ${spotUrlPart}, error: ${err}`
    );
  }

  try {
    await SpotRecentForecast.deleteOne({ spotUrlPart }).exec();
  } catch (err) {
    throw new Error(
      `Error while deleting recent forecast ${spotUrlPart}, error: ${err}`
    );
  }

  return true;
}
