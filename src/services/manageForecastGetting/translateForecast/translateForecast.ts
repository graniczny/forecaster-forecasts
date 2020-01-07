import { ElementHandle } from 'puppeteer';
import { HourForecast, DayForecast } from '../../../interfaces';

async function elementGetter(
  element: ElementHandle,
  querySelector: string
): Promise<string> {
  const node = await element.$(querySelector);
  return await node.evaluate(node => node.innerText);
}

const translateForecast = async (
  forecasts: ElementHandle[]
): Promise<DayForecast[]> => {
  const translated = await Promise.all(
    forecasts.map(async (ele: ElementHandle) => {
      const dayForecast: DayForecast = {
        day: '',
        hours: []
      };

      dayForecast.day = await elementGetter(ele, '.weathertable__headline');

      const stripes = await ele.$$('.weathertable__row ');
      dayForecast.hours = await Promise.all(
        stripes.map(async (stripe: ElementHandle) => {
          const hourForecast: HourForecast = {
            hour: '',
            windDirection: '',
            windSpeed: '',
            gusts: ''
          };

          hourForecast.hour = await elementGetter(
            stripe,
            '.cell-timespan .data-time .value'
          );
          hourForecast.windSpeed = await elementGetter(
            stripe,
            '.speed .units-ws'
          );
          hourForecast.gusts = await elementGetter(
            stripe,
            '.data-gusts .units-ws'
          );

          const directionNode = await stripe.$(
            '.data-direction-arrow .directionarrow'
          );
          hourForecast.windDirection = await directionNode.evaluate(node => {
            const title = node.title;
            return title.substring(0, title.length - 1);
          });

          return hourForecast;
        })
      );
      return dayForecast;
    })
  );
  return translated;
};

export default translateForecast;
