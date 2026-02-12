// Dependency Injection container
// Services will be registered here once they're created in feature modules

export enum InjectableType {
  AUTH = "auth-service",
  LEAGUES = "leagues-service",
  LEAGUE_NIGHTS = "league-nights-service",
  MEMBERSHIP = "membership-service",
  PROFILES = "profiles-service",
  PUSH_NOTIFICATIONS = "push-notifications-service",
  WEBSOCKETS = "websockets-service",
}

// Service instances will be stored here
const InjectablesMap: Record<string, any> = {};

// Register a service
export function registerInjectable<T>(type: InjectableType, instance: T): void {
  InjectablesMap[type] = instance;
}

// Get a service instance
export function useInjection<T>(injectable: InjectableType): T {
  const service = InjectablesMap[injectable];
  if (!service) {
    console.error(`Service ${injectable} not registered!`);
    console.error("Available services:", Object.keys(InjectablesMap));
    throw new Error(`Service ${injectable} not found in DI container`);
  }
  return service as T;
}

// Get service directly (non-hook version for use outside components)
export function getService<T>(injectable: InjectableType): T {
  return useInjection<T>(injectable);
}
