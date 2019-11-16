import Router from 'koa-router';
import HttpStatusCode from 'http-status-codes';

import { GetCurrentForecastInput } from '../interfaces';

import getForecast from '../services/getForecast';

const router = new Router();

router.post('/', async (ctx: any, next: any) => {
  const { spotUrlPart }: GetCurrentForecastInput = ctx.request.body;

  const result = await getForecast({ spotUrlPart });
  ctx.status = result.status;
  ctx.body = result.body;

  if (result.status === HttpStatusCode.BAD_REQUEST && result.error) {
    ctx.body = result.error;
  }

  return next();
});

export default router;
