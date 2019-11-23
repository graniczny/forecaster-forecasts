import Router from 'koa-router';
import config from '../utils/config';

import testRoute from './testRoute';
import forecasts from './forecasts';
import spotConfig from './spotConfig';

const router = new Router({
  prefix: config.env.api_prefix
});

router.use('/test-route', testRoute.routes(), testRoute.allowedMethods());
router.use('/spot-config', spotConfig.routes(), spotConfig.allowedMethods());
router.use('/forecasts', forecasts.routes(), forecasts.allowedMethods());

router.stack.map(layer => console.info(`Created route ${layer.path}`));

export default router;
