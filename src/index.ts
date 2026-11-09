import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSHandlerPlugin } from "@orpc/server/plugins";
import { router } from "./router";

const handler = new RPCHandler(router, {
  plugins: [new CORSHandlerPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export default {
  async fetch(request, env, ctx) {
    const { matched, response } = await handler.handle(request, {
      prefix: "/rpc",
      context: { env, ctx }, // Provide initial context if needed, can be an async function
    });

    if (matched) {
      return response;
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
