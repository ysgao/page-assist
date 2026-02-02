
export const isChatWithWebsiteEnabled = async (): Promise<boolean> => {
    const isChatWithWebsiteEnabled = await getStorage<boolean | undefined>(
        "chatWithWebsiteEmbedding"
    )
    return isChatWithWebsiteEnabled ?? false
}


import { getStorage } from "@/services/storage"

export const getMaxContextSize = async (): Promise<number> => {
    const maxWebsiteContext = await getStorage<number | undefined>(
        "maxWebsiteContext"
    )
    return maxWebsiteContext ?? 7028
}