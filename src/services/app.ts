
import { getStorage, setStorage } from "@/services/storage"
const DEFAULT_URL_REWRITE_URL = "http://127.0.0.1:11434"

export const isUrlRewriteEnabled = async () => {
  const enabled = await getStorage<boolean | undefined>("urlRewriteEnabled")
  return enabled ?? false
}
export const setUrlRewriteEnabled = async (enabled: boolean) => {
  await setStorage("urlRewriteEnabled", enabled)
}

export const getIsAutoCORSFix = async () => {
  try {
    const enabled = await getStorage<boolean | undefined>("autoCORSFix")
    return enabled ?? true
  } catch (e) {
    return true
  }
}

export const setAutoCORSFix = async (enabled: boolean) => {
  await setStorage("autoCORSFix", enabled)
}

export const getOllamaEnabled = async () => {
  try {
    const enabled = await getStorage<boolean | undefined>(
      "ollamaEnabledStatus"
    )
    return enabled ?? true
  } catch (e) {
    return true
  }
}

export const setOllamaEnabled = async (enabled: boolean) => {
  await setStorage("ollamaEnabledStatus", enabled)
}

export const getRewriteUrl = async () => {
  const rewriteUrl = await getStorage("rewriteUrl")
  if (!rewriteUrl || rewriteUrl.trim() === "") {
    return DEFAULT_URL_REWRITE_URL
  }
  return rewriteUrl
}

export const setRewriteUrl = async (url: string) => {
  await setStorage("rewriteUrl", url)
}

export const getAdvancedOllamaSettings = async () => {
  const [isEnableRewriteUrl, rewriteUrl, autoCORSFix] = await Promise.all([
    isUrlRewriteEnabled(),
    getRewriteUrl(),
    getIsAutoCORSFix()
  ])

  return {
    isEnableRewriteUrl,
    rewriteUrl,
    autoCORSFix
  }
}

export const copilotResumeLastChat = async () => {
  return await getStorage<boolean>("copilotResumeLastChat")
}

export const webUIResumeLastChat = async () => {
  return await getStorage<boolean>("webUIResumeLastChat")
}

export const defaultSidebarOpen = async () => {
  const sidebarOpen = await getStorage("sidebarOpen")
  if (!sidebarOpen || sidebarOpen === "") {
    return "right_clk"
  }
  return sidebarOpen
}

export const setSidebarOpen = async (sidebarOpen: string) => {
  await setStorage("sidebarOpen", sidebarOpen)
}

export const customOllamaHeaders = async (): Promise<
  { key: string; value: string }[]
> => {
  const headers = await getStorage<
    { key: string; value: string }[] | undefined
  >("customOllamaHeaders")
  if (!headers) {
    return []
  }
  return headers
}

export const setCustomOllamaHeaders = async (headers: string[]) => {
  await setStorage("customOllamaHeaders", headers)
}

export const getCustomOllamaHeaders = async (): Promise<
  Record<string, string>
> => {
  const headers = await customOllamaHeaders()

  const headerMap: Record<string, string> = {}

  for (const header of headers) {
    headerMap[header.key] = header.value
  }

  return headerMap
}

export const getOpenOnIconClick = async (): Promise<string> => {
  const openOnIconClick = await getStorage<string>("openOnIconClick")
  return openOnIconClick || "webUI"
}

export const setOpenOnIconClick = async (
  option: "webUI" | "sidePanel"
): Promise<void> => {
  await setStorage("openOnIconClick", option)
}

export const getOpenOnRightClick = async (): Promise<string> => {
  const openOnRightClick = await getStorage<string>("openOnRightClick")
  return openOnRightClick || "sidePanel"
}

export const setOpenOnRightClick = async (
  option: "webUI" | "sidePanel"
): Promise<void> => {
  await setStorage("openOnRightClick", option)
}

export const getTotalFilePerKB = async (): Promise<number> => {
  const totalFilePerKB = await getStorage<number>("totalFilePerKB")
  return totalFilePerKB || 5
}

export const setTotalFilePerKB = async (
  totalFilePerKB: number
): Promise<void> => {
  await setStorage("totalFilePerKB", totalFilePerKB)
}

export const getNoOfRetrievedDocs = async (): Promise<number> => {
  const noOfRetrievedDocs = await getStorage<number>("noOfRetrievedDocs")
  return noOfRetrievedDocs || 4
}

export const setNoOfRetrievedDocs = async (
  noOfRetrievedDocs: number
): Promise<void> => {
  await setStorage("noOfRetrievedDocs", noOfRetrievedDocs)
}

export const isRemoveReasoningTagFromCopy = async (): Promise<boolean> => {
  const removeReasoningTagFromCopy = await getStorage<boolean>(
    "removeReasoningTagFromCopy"
  )
  return removeReasoningTagFromCopy ?? true
}

export const getStorageSyncEnabled = async (): Promise<boolean> => {
  const enabled = await getStorage<boolean>("storageSyncEnabled")
  return enabled ?? true
}

export const setStorageSyncEnabled = async (
  enabled: boolean
): Promise<void> => {
  await setStorage("storageSyncEnabled", enabled)
}
