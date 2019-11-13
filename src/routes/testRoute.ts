import Router from 'koa-router';
import HttpStatusCode from 'http-status-codes';
import { testService } from '../services/testRoute.service';

const router = new Router();

router.post('/', async (ctx: any, next: any) => {
  const result = await testService();
  ctx.status = result.status;
  ctx.body = result.body;

  if (result.status === HttpStatusCode.BAD_REQUEST && result.error) {
    ctx.body = result.error;
  }

  return next();
});

export default router;
