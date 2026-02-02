import { browser } from "wxt/browser"

export const getStorage = async <T = any>(key: string): Promise<T | undefined> => {
    try {
        const result = await browser.storage.local.get(key) as Record<string, any>
        return result[key]
    } catch (error) {
        console.error("Error reading storage:", error)
        return undefined
    }
}

export const setStorage = async <T = any>(key: string, value: T): Promise<void> => {
    try {
        await browser.storage.local.set({ [key]: value })
    } catch (error) {
        console.error("Error setting storage:", error)
    }
}
