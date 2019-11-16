import Router from 'koa-router';
import config from '../utils/config';

import testRoute from './testRoute';
import getCurrentForecast from './getCurrentForecast';

const router = new Router({
  prefix: config.env.api_prefix
});

router.use('/test-route', testRoute.routes(), testRoute.allowedMethods());
router.use(
  '/forecast',
  getCurrentForecast.routes(),
  getCurrentForecast.allowedMethods()
);

router.stack.map(layer => console.info(`Created route ${layer.path}`));

export default router;
