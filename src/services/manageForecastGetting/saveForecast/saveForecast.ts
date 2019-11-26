import SpotRecentForecast, {
  ISpotRecentForecast
} from '../../../models/SpotRecentForecast';

export default async function saveForecasts(
  forecast: Partial<ISpotRecentForecast>
): Promise<boolean> {
  const newForecast = new SpotRecentForecast(forecast);
  try {
    await newForecast.save();
  } catch (err) {
    throw new Error(err);
  }

  return true;
}
