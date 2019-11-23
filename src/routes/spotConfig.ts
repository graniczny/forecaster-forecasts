import Router from 'koa-router';
import HttpStatusCode from 'http-status-codes';

import { ISpotConfig } from '../models/SpotConfig';

import { createSpotConfig } from '../services/createSpotConfig';

const router = new Router();

router.post('/create', async (ctx: any, next: any) => {
  const spotConfig: Partial<ISpotConfig> = ctx.request.body;

  const result = await createSpotConfig(spotConfig);
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
