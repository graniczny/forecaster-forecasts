const environments: { [s: string]: string } = {
  local: 'local',
  dev: 'dev',
  development: 'dev',
  test: 'test',
  prod: 'prod',
  production: 'prod'
};

export const environment = (env: string) => {
  return environments[env];
};
