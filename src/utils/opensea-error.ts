import { ORPCError } from "@orpc/server";

type OpenSeaError = { code?: string; errors: string[] };

export function throwOpenSeaError(error: OpenSeaError, status: number): never {
  const message = error.errors?.join("; ") || "OpenSea request failed";

  switch (status) {
    case 400:
      throw new ORPCError("BAD_REQUEST", { message, data: error });
    case 401:
    case 403:
      // Your API key is bad or missing. That's a server config problem, not the caller's fault.
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Upstream auth failed",
        cause: error,
      });
    case 404:
      throw new ORPCError("NOT_FOUND", { message, data: error });
    case 429:
      throw new ORPCError("TOO_MANY_REQUESTS", {
        message: "Upstream rate limit",
        data: error,
      });
    default:
      throw new ORPCError("BAD_GATEWAY", {
        message: "Upstream error",
        cause: error,
      });
  }
}
