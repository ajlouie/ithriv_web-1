import { AppEnvironment } from '../app/environment';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const localhost = navigator.platform.includes('Win') ? '10.0.2.2' : 'localhost';

export const environment: AppEnvironment = {
  production: false,
  api: `http://${localhost}`,
  api_commons_adapter: `http://${localhost}/commons_adapter/api/`,
  api_commons_adapter_private: `http://${localhost}/commons_adapter/api/private/`,
  landing_service: [{ name: 'UVA', url: 'https://poc.commons.ithriv.org' }],
  ga_tracking_id: 'UA-138286052-1',
};
