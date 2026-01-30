import { browser } from "wxt/browser";

export const fetchWithProxy = async (url: string, options: RequestInit = {}) => {
  if (browser && browser.runtime && browser.runtime.id) {
    try {
      // Create a serializable version of options
      const serializableOptions: any = { 
        ...options,
        // Ensure strictly serializable keys are copied if they exist
        ...(options.credentials ? { credentials: options.credentials } : {}),
        ...(options.referrerPolicy ? { referrerPolicy: options.referrerPolicy } : {}),
      };
      
      // Remove AbortSignal as it's not serializable
      if (serializableOptions.signal) {
        delete serializableOptions.signal;
      }

      // Ensure headers are plain object if possible (though some browsers serialize Headers object fine, safer to convert)
      if (serializableOptions.headers instanceof Headers) {
        const headersObj: Record<string, string> = {};
        serializableOptions.headers.forEach((value: string, key: string) => {
          headersObj[key] = value;
        });
        serializableOptions.headers = headersObj;
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
          ok: true,
          status: 200,
          headers: new Headers() // We don't get headers back currently, but could improve this later
        };
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
