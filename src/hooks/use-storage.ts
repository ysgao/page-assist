import { useEffect, useState } from "react"
import { browser } from "wxt/browser"

export const useStorage = <T = any>(key: string, initialValue?: T): [T, (value: T | ((prev: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(initialValue as T)

    useEffect(() => {
        const initialize = async () => {
            try {
                const result = await browser.storage.local.get(key)
                if (result[key] !== undefined) {
                    setStoredValue(result[key] as T)
                } else {
                    // If checking specifically for null/undefined, keep initialValue
                }
            } catch (error) {
                console.error("Error reading storage:", error)
            }
        }

        initialize()

        const listener = (changes: { [key: string]: any }, areaName: string) => {
            if (areaName === "local" && changes[key]) {
                setStoredValue(changes[key].newValue !== undefined ? changes[key].newValue : initialValue)
            }
        }

        browser.storage.onChanged.addListener(listener)

        return () => {
            browser.storage.onChanged.removeListener(listener)
        }
    }, [key, initialValue])

    const setValue = async (value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? (value as Function)(storedValue) : value
            setStoredValue(valueToStore)
            await browser.storage.local.set({ [key]: valueToStore })
        } catch (error) {
            console.error("Error setting storage:", error)
        }
    }

    return [storedValue, setValue]
}
