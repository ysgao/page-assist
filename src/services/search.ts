
import { getStorage, setStorage } from "@/services/storage"
const TOTAL_SEARCH_RESULTS = 2
const DEFAULT_PROVIDER = "duckduckgo"

const AVAILABLE_PROVIDERS = ["google", "duckduckgo", "google-gemini"] as const

export const getIsSimpleInternetSearch = async () => {
  try {
    const isSimpleInternetSearch = await getStorage("isSimpleInternetSearch")
    if (!isSimpleInternetSearch || isSimpleInternetSearch.length === 0) {
      return true
    }
    return isSimpleInternetSearch === "true"
  } catch (e) {
    return true
  }
}

export const getIsVisitSpecificWebsite = async () => {
  const isVisitSpecificWebsite = await getStorage("isVisitSpecificWebsite")
  if (!isVisitSpecificWebsite || isVisitSpecificWebsite.length === 0) {
    return true
  }
  return isVisitSpecificWebsite === "true"
}

export const setIsVisitSpecificWebsite = async (
  isVisitSpecificWebsite: boolean
) => {
  await setStorage("isVisitSpecificWebsite", isVisitSpecificWebsite.toString())
}

export const setIsSimpleInternetSearch = async (
  isSimpleInternetSearch: boolean
) => {
  await setStorage("isSimpleInternetSearch", isSimpleInternetSearch.toString())
}

export const getSearchProvider = async (): Promise<
  (typeof AVAILABLE_PROVIDERS)[number]
> => {
  const searchProvider = await getStorage("searchProvider")
  if (!searchProvider || searchProvider.length === 0) {
    return DEFAULT_PROVIDER
  }
  return searchProvider as (typeof AVAILABLE_PROVIDERS)[number]
}

export const setSearchProvider = async (searchProvider: string) => {
  await setStorage("searchProvider", searchProvider)
}

export const totalSearchResults = async () => {
  const totalSearchResults = await getStorage("totalSearchResults")
  if (!totalSearchResults || totalSearchResults.length === 0) {
    return TOTAL_SEARCH_RESULTS
  }
  return parseInt(totalSearchResults)
}

export const setTotalSearchResults = async (totalSearchResults: number) => {
  await setStorage("totalSearchResults", totalSearchResults.toString())
}

export const getSearxngURL = async () => {
  const searxngURL = await getStorage("searxngURL")
  return searxngURL || ""
}

export const isSearxngJSONMode = async () => {
  const searxngJSONMode = await getStorage<boolean>("searxngJSONMode")
  return searxngJSONMode ?? false
}

export const setSearxngJSONMode = async (searxngJSONMode: boolean) => {
  await setStorage("searxngJSONMode", searxngJSONMode)
}

export const setSearxngURL = async (searxngURL: string) => {
  await setStorage("searxngURL", searxngURL)
}

export const getBraveApiKey = async () => {
  const braveApiKey = await getStorage("braveApiKey")
  return braveApiKey || ""
}

export const getOllamaSearchApiKey = async () => {
  const ollamaSearchApiKey = await getStorage("ollamaSearchApiKey")
  return ollamaSearchApiKey || ""
}

export const getKagiApiKey = async () => {
  const kagiApiKey = await getStorage("kagiApiKey")
  return kagiApiKey || ""
}

export const getPerplexityApiKey = async () => {
  const perplexityApiKey = await getStorage("perplexityApiKey")
  return perplexityApiKey || ""
}

export const getTavilyApiKey = async () => {
  const tavilyApiKey = await getStorage("tavilyApiKey")
  return tavilyApiKey || ""
}

export const getFirecrawlAPIKey = async () => {
  const firecrawlAPIKey = await getStorage("firecrawlAPIKey")
  return firecrawlAPIKey || ""
}

export const setBraveApiKey = async (braveApiKey: string) => {
  await setStorage("braveApiKey", braveApiKey)
}

export const setOllamaSearchApiKey = async (ollamaSearchApiKey: string) => {
  await setStorage("ollamaSearchApiKey", ollamaSearchApiKey)
}

export const setKagiApiKey = async (kagiApiKey: string) => {
  await setStorage("kagiApiKey", kagiApiKey)
}

export const setPerplexityApiKey = async (perplexityApiKey: string) => {
  await setStorage("perplexityApiKey", perplexityApiKey)
}

export const setFirecrawlAPIKey = async (firecrawlAPIKey: string) => {
  await setStorage("firecrawlAPIKey", firecrawlAPIKey)
}

export const getExaAPIKey = async () => {
  const exaAPIKey = await getStorage("exaAPIKey")
  return exaAPIKey || ""
}

export const setExaAPIKey = async (exaAPIKey: string) => {
  await setStorage("exaAPIKey", exaAPIKey)
}

export const setTavilyApiKey = async (tavilyApiKey: string) => {
  await setStorage("tavilyApiKey", tavilyApiKey)
}

export const getGoogleDomain = async () => {
  const domain = await getStorage("searchGoogleDomain")
  return domain || "google.com"
}

export const setGoogleDomain = async (domain: string) => {
  await setStorage("searchGoogleDomain", domain)
}

export const getDomainFilterList = async (): Promise<string[]> => {
  const domainFilterList = await getStorage("domainFilterList")
  if (!domainFilterList || domainFilterList.length === 0) {
    return []
  }
  try {
    return JSON.parse(domainFilterList)
  } catch (e) {
    return []
  }
}

export const setDomainFilterList = async (domainFilterList: string[]) => {
  await setStorage("domainFilterList", JSON.stringify(domainFilterList))
}

export const getBlockedDomainList = async (): Promise<string[]> => {
  const blockedDomainList = await getStorage("blockedDomainList")
  if (!blockedDomainList || blockedDomainList.length === 0) {
    return []
  }
  try {
    return JSON.parse(blockedDomainList)
  } catch (e) {
    return []
  }
}

export const setBlockedDomainList = async (blockedDomainList: string[]) => {
  await setStorage("blockedDomainList", JSON.stringify(blockedDomainList))
}

export const getInternetSearchOn = async () => {
  const defaultInternetSearchOn = await getStorage<boolean | undefined>(
    "defaultInternetSearchOn"
  )
  return defaultInternetSearchOn ?? false
}

export const setInternetSearchOn = async (defaultInternetSearchOn: boolean) => {
  await setStorage("defaultInternetSearchOn", defaultInternetSearchOn)
}

export const getSearchSettings = async () => {
  const [
    isSimpleInternetSearch,
    searchProvider,
    totalSearchResult,
    visitSpecificWebsite,
    searxngURL,
    searxngJSONMode,
    braveApiKey,
    tavilyApiKey,
    googleDomain,
    defaultInternetSearchOn,
    exaAPIKey,
    firecrawlAPIKey,
    ollamaSearchApiKey,
    kagiApiKey,
    perplexityApiKey,
    domainFilterList,
    blockedDomainList
  ] = await Promise.all([
    getIsSimpleInternetSearch(),
    getSearchProvider(),
    totalSearchResults(),
    getIsVisitSpecificWebsite(),
    getSearxngURL(),
    isSearxngJSONMode(),
    getBraveApiKey(),
    getTavilyApiKey(),
    getGoogleDomain(),
    getInternetSearchOn(),
    getExaAPIKey(),
    getFirecrawlAPIKey(),
    getOllamaSearchApiKey(),
    getKagiApiKey(),
    getPerplexityApiKey(),
    getDomainFilterList(),
    getBlockedDomainList()
  ])

  return {
    isSimpleInternetSearch,
    searchProvider,
    totalSearchResults: totalSearchResult,
    visitSpecificWebsite,
    searxngURL,
    searxngJSONMode,
    braveApiKey,
    tavilyApiKey,
    googleDomain,
    defaultInternetSearchOn,
    exaAPIKey,
    firecrawlAPIKey,
    ollamaSearchApiKey,
    kagiApiKey,
    perplexityApiKey,
    domainFilterList,
    blockedDomainList
  }
}

export const setSearchSettings = async ({
  isSimpleInternetSearch,
  searchProvider,
  totalSearchResults,
  visitSpecificWebsite,
  searxngJSONMode,
  searxngURL,
  braveApiKey,
  tavilyApiKey,
  googleDomain,
  defaultInternetSearchOn,
  exaAPIKey,
  firecrawlAPIKey,
  ollamaSearchApiKey,
  kagiApiKey,
  perplexityApiKey,
  domainFilterList,
  blockedDomainList
}: {
  isSimpleInternetSearch: boolean
  searchProvider: string
  totalSearchResults: number
  visitSpecificWebsite: boolean
  searxngURL: string
  searxngJSONMode: boolean
  braveApiKey: string
  tavilyApiKey: string
  googleDomain: string
  defaultInternetSearchOn: boolean
  exaAPIKey: string
  firecrawlAPIKey: string
  ollamaSearchApiKey: string
  kagiApiKey: string
  perplexityApiKey: string
  domainFilterList: string[]
  blockedDomainList: string[]
}) => {
  await Promise.all([
    setIsSimpleInternetSearch(isSimpleInternetSearch),
    setSearchProvider(searchProvider),
    setTotalSearchResults(totalSearchResults),
    setIsVisitSpecificWebsite(visitSpecificWebsite),
    setSearxngJSONMode(searxngJSONMode),
    setSearxngURL(searxngURL),
    setBraveApiKey(braveApiKey),
    setTavilyApiKey(tavilyApiKey),
    setGoogleDomain(googleDomain),
    setInternetSearchOn(defaultInternetSearchOn),
    setExaAPIKey(exaAPIKey),
    setFirecrawlAPIKey(firecrawlAPIKey),
    setOllamaSearchApiKey(ollamaSearchApiKey),
    setKagiApiKey(kagiApiKey),
    setPerplexityApiKey(perplexityApiKey),
    setDomainFilterList(domainFilterList),
    setBlockedDomainList(blockedDomainList)
  ])
}
