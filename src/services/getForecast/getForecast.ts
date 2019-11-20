import httpStatusCodes from 'http-status-codes';
import { ElementHandle } from 'puppeteer';

import {
  GetCurrentForecastInput,
  StandardReturnToRouter
} from '../../interfaces';

import scope from '../../utils/chromeCrawler/scope';
import {
  runBlankPage,
  shutDownBrowser
} from '../../utils/chromeCrawler/handlers';
import readForecast from './readForecast';
import translateForecast from './translateForecast';

const getForecast = async ({
  spotUrlPart
}: GetCurrentForecastInput): Promise<StandardReturnToRouter> => {
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

  // TODO dodać zapisywanie do bazy here

  return {
    status: httpStatusCodes.OK
  };
};

export default getForecast;
