import Arweave from "arweave";
import { ArweaveSigner, TurboFactory } from "@ardrive/turbo-sdk";

const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
});

export async function getTurbo() {
  const key = await arweave.wallets.generate();
  const signer = new ArweaveSigner(key);
  return TurboFactory.authenticated({ signer });
}
