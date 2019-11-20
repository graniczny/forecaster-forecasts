import { Browser, BrowserContext, Page } from 'puppeteer';

interface Scope {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

const scope: Scope = {
  browser: null,
  context: null,
  page: null
};

export default scope;
