import { launch } from 'puppeteer';

import scope from '../scope';

const headless: boolean = process.env.SHOW_BROWSER === 'true';
const slowMo: number = headless ? 60 : 0;

export async function runBlankPage(): Promise<boolean> {
  try {
    scope.browser = await launch({
      headless: false,
      slowMo
    });
  } catch (err) {
    throw new Error(`Error while launching pupeteer, error: ${err}`);
  }

  try {
    scope.context = await scope.browser.createIncognitoBrowserContext();
  } catch (err) {
    throw new Error(`Error while creating browser context, error: ${err}`);
  }

  try {
    scope.page = await scope.context.newPage();
  } catch (err) {
    throw new Error(`Error while creating new page, error: ${err}`);
  }
  return true;
}
