export const INTERNAL_HEALTH_PATH = "/internal/health";

export function isInternalHealthPath(pathname: string) {
  return pathname === INTERNAL_HEALTH_PATH;
}
