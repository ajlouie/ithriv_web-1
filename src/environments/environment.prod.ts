import { AppEnvironment } from '../app/environment';

const servicehost = 'portal.ithriv.org';

export const environment: AppEnvironment = {
  envName: 'prod',
  production: true,
  api: 'https://portal.ithriv.org',
  ga_tracking_id: 'UA-112017665-3',
  api_commons_adapter: `https://${servicehost}/commons_adapter/api/`,
  api_commons_adapter_private: `https://${servicehost}/commons_adapter/api/private/`,
  landing_service: [{ name: 'UVA', url: 'https://uvathrivp.healthsystem.virginia.edu' }],
};
