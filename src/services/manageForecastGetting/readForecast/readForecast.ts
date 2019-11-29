import { ElementHandle } from 'puppeteer';

import { GetCurrentForecastInput } from '../../../interfaces';

import scope from '../../../utils/chromeCrawler/scope';
import { goToPage } from '../../../utils/chromeCrawler/handlers';

const readForecast = async ({
  spotUrlPart
}: Partial<GetCurrentForecastInput>): Promise<ElementHandle[]> => {
  //
  // TODO split pupeteer code into modules

  try {
    await goToPage(spotUrlPart);
  } catch (err) {
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
    throw new Error(
      `There is a problem while accepting cookies just after site enter, error: ${err.message}`
    );
  }

  let forecastsHtmlNodes: ElementHandle[];
  try {
    forecastsHtmlNodes = await scope.page.$$('.weathertable.forecast');
  } catch (err) {
    throw new Error(`There is a problem with geting forecasts, error: ${err}`);
  }
  if (!forecastsHtmlNodes || forecastsHtmlNodes.length !== 10) {
    throw new Error('There is a problem with geting forecasts');
  }

  return forecastsHtmlNodes;
};

export default readForecast;
