export interface LandingService {
  name: string;
  url: string;
}

export interface AppEnvironment {
  envName?: string;
  production: boolean;
  api: string;
  api_commons_adapter?: string;
  api_commons_adapter_private?: string;
  landing_service?: LandingService[];
  ga_tracking_id: string;
}
