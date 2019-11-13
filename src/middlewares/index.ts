import { Middleware } from 'koa';
import compose from 'koa-compose';
import config from '../utils/config';

import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import handleErrors from './error';

export default (): Middleware => {
  return compose([
    handleErrors(),
    cors({ origin: config.cors.allowedOrigin }),
    bodyParser()
  ]);
};
