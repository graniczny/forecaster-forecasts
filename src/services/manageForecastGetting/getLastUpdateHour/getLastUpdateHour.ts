import scope from '../../../utils/chromeCrawler/scope';

export default async function getLastUpdateHour(): Promise<string> {
  let lastUpdateHour: string;
  try {
    const lastUpdateHourNode = await scope.page.$('.forecastinfo #last-update');
    lastUpdateHour = await lastUpdateHourNode.evaluate(node => node.innerText);
  } catch (err) {
    throw new Error(
      `There is a problem with geting last update hour, error: ${err}`
    );
  }
  return lastUpdateHour;
}
