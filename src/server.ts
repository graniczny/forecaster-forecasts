import config from './utils/config';

import Koa from 'koa';
import routes from './routes';
import middlewares from './middlewares';

import './db/connect';

const app = new Koa();
app
  .use(middlewares())
  .use(routes.routes())
  .use(routes.allowedMethods());

export async function initServer(port: number) {
  return app.listen(port);
}

if (config.env.env !== 'test') {
  try {
    const port = config.env.port || 3001;
    initServer(port);
    console.info(`Listening to http://localhost:${port}`);
  } catch (err) {
    console.error(err);
  }
}

export default app;
