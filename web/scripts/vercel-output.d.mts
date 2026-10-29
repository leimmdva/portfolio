export function inlineScriptHashes(documents: string[]): string[];
export function contentSecurityPolicy(scriptHashes: string[]): string;
export function securityHeaders(scriptHashes: string[]): Record<string, string>;
export function outputConfig(scriptHashes: string[]): {
  version: 3;
  routes: Array<
    | { src: string; headers?: Record<string, string>; continue?: boolean; status?: number; dest?: string }
    | { handle: "filesystem" }
  >;
};
