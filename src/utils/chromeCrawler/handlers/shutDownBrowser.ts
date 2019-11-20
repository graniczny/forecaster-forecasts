import scope from '../scope';

export async function shutDownBrowser(): Promise<boolean> {
  try {
    await scope.context.close();
    await scope.browser.close();
  } catch (err) {
    throw new Error('There was a problem while closing browser.');
  }
  return true;
}
