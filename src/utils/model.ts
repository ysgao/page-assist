import { getModelInfo, isCustomModel } from "@/db/dexie/models"

import { getStorage } from "@/services/storage"
export const getSelectedModelName = async (): Promise<string> => {
    const selectedModel = await getStorage("selectedModel")
    const isCustom = isCustomModel(selectedModel)
    if (isCustom) {
        const customModel = await getModelInfo(selectedModel)
        if (customModel) {
            return customModel.name
        } else {
            return selectedModel
        }
    }
    return selectedModel
}