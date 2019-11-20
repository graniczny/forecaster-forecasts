import scope from '../scope';

export async function goToPage(url: string): Promise<boolean> {
  try {
    await scope.page.goto(`${process.env.FORECAST_URL}${url}`, {
      waitUntil: 'networkidle2'
    });
  } catch (err) {
    throw new Error(err);
  }
  return true;
}
