import * as fs from 'fs';
import dotenv from 'dotenv';
import { environment } from './environment';

dotenv.config();

const env = environment(
  process.env.NODE_ENV || process.env.ENV || 'development'
);
const config = JSON.parse(fs.readFileSync(`etc/${env}.config.json`, 'utf-8'));

process.stdout.write(
  `Found default ${env} config: ${JSON.stringify(config)}\n`
);
process.stdout.write(`Applying "process.env.{X}" evals...\n`);

const apply = (obj: any, ref: any, index: number) => {
  if (typeof obj == 'string' && obj.includes('process.env.')) {
    obj = obj.replace('process.env.', '');
    process.stdout.write(
      `Applying to config process.env.${obj} -> ${process.env[obj]}\n`
    );
    ref[index] = process.env[obj];
  }
};

function traverse(o: any, func: any) {
  for (const i in o) {
    func.apply(this, [o[i], o, i]);
    if (o[i] !== null && typeof o[i] == 'object') {
      traverse(o[i], func);
    }
  }
}

traverse(config, apply);
process.stdout.write(`Loaded config: ${JSON.stringify(config)}\n`);

export default config;
