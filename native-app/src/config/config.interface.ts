export enum ConfigMode {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export interface Config {
  mode: ConfigMode;
  supabase: {
    url: string;
    anonKey: string;
  };
  api: {
    baseUrl: string;
  };
  expo?: {
    projectId: string;
  };
}
