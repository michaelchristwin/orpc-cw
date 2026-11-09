import createClient from "openapi-fetch";
import type { paths } from "./opensea";

export function createOpenSea(apiKey: string) {
  return createClient<paths>({
    baseUrl: "https://api.opensea.io",
    headers: { "x-api-key": apiKey },
  });
}
