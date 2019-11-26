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

  // todo tutaj trzeba sprawdzic wtf z tymi forecastami, ktore mysla ze sa inne
  let forecastsDiffers = false;
  previousForecast.forecasts.forEach((dayForecast, dayIndex) => {
    dayForecast.hours.forEach((hourForecast, hourIndex) => {
      if (
        hourForecast.gusts !==
          forecast.forecasts[dayIndex].hours[hourIndex].gusts ||
        hourForecast.windSpeed !==
          forecast.forecasts[dayIndex].hours[hourIndex].windSpeed ||
        hourForecast.windDirection !==
          forecast.forecasts[dayIndex].hours[hourIndex].windDirection
      ) {
        forecastsDiffers = true;
      }
    });
  });
  if (!forecastsDiffers) {
    return false;
  }
  return true;
}
