import { z } from "zod";

export const chainEnum = z.enum([
  "base",
  "ethereum",
  "zora",
  "arbitrum",
  "sei",
  "avalanche",
  "polygon",
  "optimism",
  "ape_chain",
  "flow",
  "soneium",
  "ronin",
  "bera_chain",
  "solana",
  "shape",
  "unichain",
  "gunzilla",
  "abstract",
  "animechain",
  "hyperevm",
  "somnia",
  "monad",
  "hyperliquid",
  "megaeth",
  "ink",
  "robinhood",
]);

export const attribute = z.object({
  display_type: z.optional(z.string()),
  trait_type: z.string(),
  value: z.string().or(z.number().positive()),
});
