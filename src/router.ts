import { z } from "zod";
import { os } from "@orpc/server";
import { getTurbo } from "./arweave";
import { attribute, chainEnum } from "./models";
import { createOpenSea } from "./opensea-client";
import { env } from "cloudflare:workers";
import { throwOpenSeaError } from "./utils/opensea-error";

const opensea = createOpenSea(env.OPENSEA_API_KEY);

export const uploadMetadata = os
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      image: z.string(),
      attributes: z.array(attribute),
    }),
  )
  .handler(async ({ input }) => {
    const turbo = await getTurbo();
    const result = await turbo.upload({
      data: JSON.stringify(input),
      dataItemOpts: {
        tags: [
          { name: "Content-Type", value: "application/json" },
          { name: "App-Name", value: "M3trs" },
          { name: "Title", value: input.name },
        ],
      },
    });
    return new URL(`https://arweave.net/${result.id}`);
  });

export const uploadSvg = os
  .input(z.object({ image: z.string(), name: z.string() }))
  .handler(async ({ input: { image, name } }) => {
    const turbo = await getTurbo();
    const result = await turbo.upload({
      data: Buffer.from(image),
      dataItemOpts: {
        tags: [
          { name: "Content-Type", value: "image/svg+xml" },
          { name: "Title", value: name },
        ],
      },
    });
    return `https://arweave.net/${result.id}`;
  });

export const getNftsByAccount = os
  .input(
    z.object({
      address: z.string(),
      chain: chainEnum,
    }),
  )
  .handler(async ({ input }) => {
    const { data, error, response } = await opensea.GET(
      "/api/v2/chain/{chain}/account/{address}/nfts",
      {
        params: { path: { address: input.address, chain: input.chain } },
      },
    );
    if (error) throwOpenSeaError(error, response.status);
    return data;
  });

export const getNftOwners = os
  .input(
    z.object({ chain: chainEnum, address: z.string(), identifier: z.string() }),
  )
  .handler(async ({ input: { chain, address, identifier } }) => {
    const { response, error, data } = await opensea.GET(
      "/api/v2/chain/{chain}/contract/{address}/nfts/{identifier}/owners",
      {
        params: { path: { chain, address, identifier } },
      },
    );
    if (error) throwOpenSeaError(error, response.status);
    return data;
  });

export const getNftsByContract = os
  .input(z.object({ chain: chainEnum, address: z.string() }))
  .handler(async ({ input: { chain, address } }) => {
    const { response, error, data } = await opensea.GET(
      "/api/v2/chain/{chain}/contract/{address}/nfts",
      {
        params: { path: { chain, address } },
      },
    );
    if (error) throwOpenSeaError(error, response.status);
    return data;
  });

export const getBestListingsByCollection = os
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input: { slug } }) => {
    const { response, error, data } = await opensea.GET(
      "/api/v2/listings/collection/{slug}/best",
      {
        params: { path: { slug } },
      },
    );
    if (error) throwOpenSeaError(error, response.status);
    return data;
  });

export const getNftMetadata = os
  .input(
    z.object({
      chain: chainEnum,
      contractAddress: z.string(),
      tokenId: z.string(),
    }),
  )
  .handler(async ({ input: { chain, contractAddress, tokenId } }) => {
    const { response, error, data } = await opensea.GET(
      "/api/v2/metadata/{chain}/{contractAddress}/{tokenId}",
      {
        params: { path: { chain, contractAddress, tokenId } },
      },
    );
    if (error) throwOpenSeaError(error, response.status);
    return data;
  });

export const router = {
  upload: {
    metadata: uploadMetadata,
    svg: uploadSvg,
  },
  nfts: {
    account: getNftsByAccount,
    metadata: getNftMetadata,
    owners: getNftOwners,
    contract: getNftsByContract,
    collection: getBestListingsByCollection,
  },
};
