import { getCustomOllamaHeaders } from "@/services/app"
import { fetchWithProxy } from "./fetch-proxy"


const fetcher = async (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> => {
    const update: RequestInit = { ...init }
    const customHeaders = await getCustomOllamaHeaders()
    update.headers = {
        ...(update?.headers || {}),
        ...customHeaders,
    }

    const url = typeof input === "string" ? input : (input as URL).toString()
    // NOTE: This might need more refinement if input is a Request object
    return fetchWithProxy(url, update) as any
}

export default fetcher