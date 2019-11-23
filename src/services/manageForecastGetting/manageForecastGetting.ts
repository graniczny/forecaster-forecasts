import httpStatusCodes from 'http-status-codes';
import { ElementHandle } from 'puppeteer';

import {
  GetCurrentForecastInput,
  StandardReturnToRouter
} from '../../interfaces';
import SpotConfig, { ISpotConfig } from '../../models/SpotConfig';
import SpotRecentForecast, {
  ISpotRecentForecast
} from '../../models/SpotRecentForecast';

import {
  runBlankPage,
  shutDownBrowser
} from '../../utils/chromeCrawler/handlers';
import readForecast from './readForecast';
import translateForecast from './translateForecast';

const getForecast = async ({
  spotUrlPart,
  spotName
}: GetCurrentForecastInput): Promise<StandardReturnToRouter> => {
  let spotConfigurationObj: Partial<ISpotConfig>;
  try {
    spotConfigurationObj = await SpotConfig.findOne({ spotUrlPart }).exec();
  } catch (err) {
    console.error(
      `[getForecast()] error while searching for spot configuration object, error: ${err}`
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
      `[getForecast()] error while launching blank page, error: ${err}`
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
      `[getForecast()] error while reading forecast, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  let dbSuitedForecast: any;
  try {
    dbSuitedForecast = await translateForecast(recentForecast);
  } catch (err) {
    console.error(
      `[getForecast()] error while translating forecast into wanted DB format, error: ${err}`
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
      `[getForecast()] error while shuting down browser, error: ${err}`
    );
    return {
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
      error: err.message
    };
  }

  // TODO zobaczyć czy ten interfejsy Icostam sa dobrze uzyte, czy moze tam partiali nie trzeba
  const spotRecentForecast: ISpotRecentForecast = {
    spotName,
    spotUrlPart,
    timestamp: new Date().getTime(),
    forecasts: dbSuitedForecast
  };

  // TODO dodać zapisywanie do bazy here

  return {
    status: httpStatusCodes.OK
  };
};

export default getForecast;
