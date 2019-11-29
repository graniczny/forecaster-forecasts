import SpotRecentForecast, {
  ISpotRecentForecast
} from '../../../models/SpotRecentForecast';

export default async function validateForecast(
  forecast: Partial<ISpotRecentForecast>
): Promise<boolean> {
  let previousForecast: Partial<ISpotRecentForecast>;
  try {
    previousForecast = await SpotRecentForecast.findOne({
      spotName: forecast.spotName,
      spotUrlPart: forecast.spotUrlPart
    })
      .lean()
      .exec();
  } catch (err) {
    throw new Error(
      `Error while getting existing forecast in database for spot ${forecast.spotName}, error: ${err}`
    );
  }
  if (!previousForecast) {
    return true;
  }

  if (
    previousForecast.lastUpdateHour === forecast.lastUpdateHour &&
    previousForecast.forecasts[0].day === forecast.forecasts[0].day
  ) {
    return false;
  }

  return true;
}
