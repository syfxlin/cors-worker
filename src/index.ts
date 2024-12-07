function addHeaders(request: Request, response: Response) {
  const clone = new Response(response.body, response);
  clone.headers.set("Access-Control-Allow-Origin", request.headers.get("Origin") || "*");
  clone.headers.set("Access-Control-Allow-Methods", "*");
  clone.headers.set("Access-Control-Allow-Headers", "*");
  clone.headers.set("Access-Control-Allow-Credentials", "true");
  return clone;
}

export default {
  async fetch(request): Promise<Response> {
    try {
      const source = new URL(request.url);
      const target = decodeURIComponent(decodeURIComponent(source.search.substring(1)));

      if (request.method === "OPTIONS") {
        return addHeaders(request, new Response(null));
      }

      return addHeaders(request, await fetch(target, {
        redirect: "follow",
        body: request.body,
        method: request.method,
        headers: request.headers,
      }));
    } catch (e: any) {
      return new Response(e.stack || e, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
