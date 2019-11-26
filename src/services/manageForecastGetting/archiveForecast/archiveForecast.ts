import SpotRecentForecast, {
  ISpotRecentForecast
} from '../../../models/SpotRecentForecast';

import ForecastsArchive from '../../../models/ForecastsArchive';

export default async function archiveForecast(
  spotUrlPart: string
): Promise<boolean> {
  let recentForecast: Partial<ISpotRecentForecast>;
  try {
    recentForecast = await SpotRecentForecast.findOne({ spotUrlPart })
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

  const newArchivedForecast = new ForecastsArchive(recentForecast);
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
