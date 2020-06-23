const servicehost = 'dev.ithriv.org';

export const environment = {
  envName: 'dev',
  production: false,
  api: `https://${servicehost}`,
  api_commons_adapter: `https://${servicehost}/commons_adapter/api/`,
  api_commons_adapter_private: `https://${servicehost}/commons_adapter/api/private/`,
  landing_service: [{ name: 'UVA', url: 'https://poc.commons.ithriv.org:80' }],
  ga_tracking_id: 'UA-138286052-1',
};
