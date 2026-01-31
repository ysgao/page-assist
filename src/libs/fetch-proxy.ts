import { browser } from "wxt/browser";

export interface ProxyRequestInit extends RequestInit {
  stream?: boolean;
}

export const fetchWithProxy = async (url: string, options: ProxyRequestInit = {}): Promise<Response> => {
  if (browser && browser.runtime && browser.runtime.id) {
    try {
      // Create a serializable version of options
      const serializableOptions: any = {
        ...options,
      };

      // Remove AbortSignal as it's not serializable
      if (serializableOptions.signal) {
        delete serializableOptions.signal;
      }

      // Handle body if it's a blob or other non-serializable type (simplified for now)
      // If it's a string, it's already serializable.

      // Ensure headers are plain object
      const headersObj: Record<string, string> = {};
      if (options.headers) {
        if (options.headers instanceof Headers) {
          options.headers.forEach((value: string, key: string) => {
            headersObj[key] = value;
          });
        } else if (Array.isArray(options.headers)) {
          options.headers.forEach(([key, value]) => {
            headersObj[key] = value;
          });
        } else {
          Object.assign(headersObj, options.headers);
        }
      }
      serializableOptions.headers = headersObj;

      if (options.stream) {
        return new Promise((resolve, reject) => {
          const port = browser.runtime.connect({ name: "fetch_stream" });
          let metadataResolved = false;

          const stream = new ReadableStream({
            start(controller) {
              port.onMessage.addListener((msg) => {
                if (msg.type === "metadata") {
                  if (!metadataResolved) {
                    metadataResolved = true;
                    resolve({
                      ok: msg.status >= 200 && msg.status < 300,
                      status: msg.status,
                      statusText: msg.statusText,
                      headers: new Headers(msg.headers),
                      url: msg.url,
                      body: stream,
                      // For compatibility with code that calls response.text() on a stream
                      text: async () => { throw new Error("text() not supported on stream") },
                      json: async () => { throw new Error("json() not supported on stream") },
                    } as any);
                  }
                } else if (msg.type === "chunk") {
                  controller.enqueue(new Uint8Array(msg.value));
                } else if (msg.type === "done") {
                  controller.close();
                } else if (msg.type === "error") {
                  if (!metadataResolved) {
                    reject(new Error(msg.error));
                  } else {
                    controller.error(new Error(msg.error));
                  }
                }
              });

              port.onDisconnect.addListener(() => {
                try { controller.close(); } catch (e) { }
              });
            },
            cancel() {
              port.disconnect();
            }
          });

          port.postMessage({
            type: "start_fetch",
            url,
            options: serializableOptions
          });
        });
      }

      const response = await browser.runtime.sendMessage({
        type: "fetch_url",
        url,
        options: serializableOptions
      });

      if (response && response.success) {
        return {
          text: async () => response.text,
          json: async () => JSON.parse(response.text),
          blob: async () => {
            // If we need blob support, we might need to send base64 back
            throw new Error("Blob support not yet implemented in proxy");
          },
          arrayBuffer: async () => {
            // Convert string back to ArrayBuffer
            // Note: This might have issues with non-UTF8 binary data if fetched as text
            const encoder = new TextEncoder();
            return encoder.encode(response.text).buffer;
          },
          ok: response.status >= 200 && response.status < 300,
          status: response.status || 200,
          statusText: response.statusText || "OK",
          headers: new Headers(response.headers || {}),
          url: response.url || url
        } as any;
      } else {
        throw new Error(response?.error || "Fetch failed in background");
      }
    } catch (e) {
      console.warn("Proxy fetch failed, falling back to direct fetch", e);
      return fetch(url, options);
    }
  }
  return fetch(url, options);
};
