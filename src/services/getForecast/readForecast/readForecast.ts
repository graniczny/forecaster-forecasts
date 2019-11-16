import { launch, ElementHandle } from 'puppeteer';

import { GetCurrentForecastInput } from '../../../interfaces';

import scope from './chromeCrawler/scope';

const headless: boolean = process.env.SHOW_BROWSER === 'true';
const slowMo: number = headless ? 60 : 0;

const readForecast = async ({
  spotUrlPart
}: GetCurrentForecastInput): Promise<ElementHandle[]> => {
  // TODO split pupeteer code into modules
  scope.browser = await launch({
    headless: false,
    slowMo
  });
  scope.context = await scope.browser.createIncognitoBrowserContext();
  scope.page = await scope.context.newPage();

  try {
    await scope.page.goto(`${process.env.FORECAST_URL}${spotUrlPart}`, {
      waitUntil: 'networkidle2'
    });
  } catch (err) {
    console.error(
      `[readForecast()] error while going to wanted URL, error: ${err}`
    );
    throw new Error(
      `There is a problem while going to wanted URL, error: ${err}`
    );
  }

  let acceptCookiesButtonOk: ElementHandle;
  try {
    acceptCookiesButtonOk = await scope.page.waitForSelector(
      '#sncmp-popup-ok-button'
    );
    await acceptCookiesButtonOk.click();
  } catch (err) {
    console.error(
      `[readForecast()] error while accepting cookies just after site enter, error: ${err}`
    );
  }

  let forecastsHtmlNodes: ElementHandle[];
  try {
    forecastsHtmlNodes = await scope.page.$$('.weathertable.forecast');
  } catch (err) {
    console.error(
      `[readForecast()] error while geting wanted forecasts, error: ${err}`
    );
    throw new Error(`There is a problem with geting forecasts, error: ${err}`);
  }
  if (!forecastsHtmlNodes || forecastsHtmlNodes.length !== 10) {
    throw new Error('There is a problem with geting forecasts');
  }
  await scope.context.close();
  await scope.browser.close();

  return forecastsHtmlNodes;
};

export default readForecast;
