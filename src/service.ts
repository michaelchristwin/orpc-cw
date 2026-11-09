import { getTurbo } from "./arweave";

export async function uploadData(input: { name: string; city: string }) {
  const turbo = await getTurbo();
  //   const body = {
  //     name: "Jan Hus",
  //     city: "Husinec",
  //   };
  const result = await turbo.upload({
    data: JSON.stringify(input),
    dataItemOpts: {
      tags: [
        { name: "Content-Type", value: "application/json" },
        { name: "App-Name", value: "Reformation" },
        { name: "Title", value: input.name },
      ],
    },
  });
  return new URL(`https://arweave.net/${result.id}`);
}
