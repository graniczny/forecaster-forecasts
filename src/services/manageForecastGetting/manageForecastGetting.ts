import httpStatusCodes from 'http-status-codes';
import { ElementHandle } from 'puppeteer';

import {
  GetCurrentForecastInput,
  StandardReturnToRouter,
  DayForecast
} from '../../interfaces';
import SpotConfig, { ISpotConfig } from '../../models/SpotConfig';
import { ISpotRecentForecast } from '../../models/SpotRecentForecast';

import {
  runBlankPage,
  shutDownBrowser
} from '../../utils/chromeCrawler/handlers';
import readForecast from './readForecast';
import translateForecast from './translateForecast';
import validateForecast from './validateForecast';
import archiveForecast from './archiveForecast';
import saveForecast from './saveForecast';
import getLastUpdateHour from './getLastUpdateHour';

const manageForecastGetting = async ({
  spotUrlPart,
  spotName
}: GetCurrentForecastInput): Promise<StandardReturnToRouter> => {
  let spotConfigurationObj: Partial<ISpotConfig>;
  try {
    spotConfigurationObj = await SpotConfig.findOne({
      spotUrlPart,
      spotName
    }).exec();
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while searching for spot configuration object, error: ${err}`
    );
    return {
      status: httpStatusCodes.BAD_REQUEST,
      error: err.message
    };
  }
  if (!spotConfigurationObj) {
    return {
      status: httpStatusCodes.BAD_REQUEST,
      error: 'Could not find configuration for given spot data'
    };
  }

  try {
    await runBlankPage();
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while launching blank page, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  let recentForecast: ElementHandle[];
  try {
    recentForecast = await readForecast({ spotUrlPart });
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while reading forecast, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  let dbSuitedForecast: DayForecast[];
  try {
    dbSuitedForecast = await translateForecast(recentForecast);
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while translating forecast into wanted DB format, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  let lastUpdateHour: string;
  try {
    lastUpdateHour = await getLastUpdateHour();
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while getting last update hour, error: ${err.message}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  try {
    await shutDownBrowser();
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while shuting down browser, error: ${err.message}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  // TODO zobaczyć czy ten interfejsy Icostam sa dobrze uzyte, czy moze tam partiali nie trzeba
  const spotRecentForecast: Partial<ISpotRecentForecast> = {
    spotName,
    spotUrlPart,
    lastUpdateHour,
    timestamp: new Date().getTime(),
    forecasts: dbSuitedForecast
  };

  let isValid: boolean;
  try {
    isValid = await validateForecast(spotRecentForecast);
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while validating forecast, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }
  if (!isValid) {
    console.log(`Forecast is invalid`);
    return {
      status: httpStatusCodes.BAD_REQUEST,
      error: 'Forecast is invalid or it is already in db.'
    };
  }

  try {
    await archiveForecast(spotUrlPart);
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while archiving forecast, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  try {
    await saveForecast(spotRecentForecast);
  } catch (err) {
    console.error(
      `[manageForecastGetting()] error while saving forecast, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  return {
    status: httpStatusCodes.OK
  };
};

export default manageForecastGetting;
