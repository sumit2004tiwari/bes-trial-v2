import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, FetchDidFailCallbackParam } from "serwist";
import { Serwist, BackgroundSyncQueue, NetworkOnly, NetworkFirst, ExpirationPlugin } from "serwist";

const mutationQueue = new BackgroundSyncQueue("api-mutations", {
  maxRetentionTime: 60 * 24,
  onSync: async ({ queue }) => {
    await queue.replayRequests();
    const sw = self as any;
    const clients = await sw.clients.matchAll();
    for (const client of clients) {
      client.postMessage({ type: "SYNC_COMPLETE" });
    }
  },
});

const serwist = new Serwist({
  precacheEntries: (self as unknown as { __SW_MANIFEST: PrecacheEntry[] })
    .__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    {
      matcher: ({ request, sameOrigin, url: { pathname } }) =>
        sameOrigin &&
        !pathname.startsWith("/api/") &&
        request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "pages",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60,
          }),
          {
            cacheDidUpdate: async ({ request }) => {
              try {
                const rscCache = await caches.open("pages-rsc");
                const rscReq = new Request(request.url, {
                  headers: { RSC: "1" },
                });
                const rscRes = await fetch(rscReq);
                if (rscRes.ok) rscCache.put(request.url, rscRes);
              } catch {
                /* empty */
              }
            },
          },
        ],
      }),
    },
    {
      matcher: ({ request, url }) =>
        url.pathname.startsWith("/backend/api/") &&
        !["GET", "HEAD"].includes(request.method),
      handler: new NetworkOnly({
        plugins: [
          {
            fetchDidFail: ({ request }: FetchDidFailCallbackParam) =>
              mutationQueue.pushRequest({ request }),
          },
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline.html",
        matcher: ({ request }) => request.mode === "navigate",
      },
    ],
  },
});

serwist.addEventListeners();

/* eslint-disable */
const sw = self as any;

sw.addEventListener("activate", (event: any) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open("pages");
      const clients = await sw.clients.matchAll({ type: "window" });
      await Promise.all(
        clients.map(async (client: any) => {
          const url = new URL(client.url);
          if (url.origin === location.origin) {
            const cached = await cache.match(url.pathname, {
              ignoreSearch: true,
            });
            if (!cached) {
              try {
                const response = await fetch(url.pathname);
                if (response.ok) cache.put(url.pathname, response);
              } catch {
                /* empty */
              }
            }
          }
        }),
      );
    })(),
  );
});

sw.addEventListener("message", (event: any) => {
  if (event.data?.type === "GET_PENDING_COUNT") {
    mutationQueue.getAll().then((entries) => {
      if (event.ports?.[0]) {
        event.ports[0].postMessage({ pendingCount: entries.length });
      }
    });
    return;
  }

  if (event.data?.type === "SYNC_NOW") {
    const sw = self as any;
    event.waitUntil(
      mutationQueue.replayRequests().then(() =>
        sw.clients.matchAll().then((clients: any[]) => {
          for (const client of clients) {
            client.postMessage({ type: "SYNC_COMPLETE" });
          }
        })
      )
    );
    return;
  }
});
/* eslint-enable */
