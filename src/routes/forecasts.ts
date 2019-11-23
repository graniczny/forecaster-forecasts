import Router from 'koa-router';
import HttpStatusCode from 'http-status-codes';

import { GetCurrentForecastInput } from '../interfaces';

import getForecast from '../services/manageForecastGetting';

const router = new Router();

router.post('/getOne', async (ctx: any, next: any) => {
  const { spotUrlPart, spotName }: GetCurrentForecastInput = ctx.request.body;

  const result = await getForecast({ spotUrlPart, spotName });
  ctx.status = result.status;
  if (result.body) {
    ctx.body = result.body;
  }
  if (result.status !== HttpStatusCode.OK && result.error) {
    ctx.body = result.error;
  }

  return next();
});

export default router;
