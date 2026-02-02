import { getStorage, setStorage } from "@/services/storage"
import { browser } from "wxt/browser"

const DEFAULT_SUMMARY_PROMPT = `Provide a concise summary of the following text, capturing its main ideas and key points:

Text:
---------
{text}
---------

Summarize the text in no more than 3-4 sentences.

Response:`

const DEFAULT_REPHRASE_PROMPT = `Rewrite the following text in a different way, maintaining its original meaning but using alternative vocabulary and sentence structures:

Text:
---------
{text}
---------

Ensure that your rephrased version conveys the same information and intent as the original.

Response:`

const DEFAULT_TRANSLATE_PROMPT = `Translate the following text from its original language into "english". Maintain the tone and style of the original text as much as possible:

Text:
---------
{text}
---------

Response:`

const DEFAULT_EXPLAIN_PROMPT = `Provide a detailed explanation of the following text, breaking down its key concepts, implications, and context:

Text:
---------
{text}
---------

Your explanation should:

Clarify any complex terms or ideas
Provide relevant background information
Discuss the significance or implications of the content
Address any potential questions a reader might have
Use examples or analogies to illustrate points when appropriate

Aim for a comprehensive explanation that would help someone with little prior knowledge fully understand the text.

Response:`

const DEFAULT_CUSTOM_PROMPT = `{text}`

export const getSummaryPrompt = async () => {
    return (await getStorage("copilotSummaryPrompt")) || DEFAULT_SUMMARY_PROMPT
}

export const setSummaryPrompt = async (prompt: string) => {
    await setStorage("copilotSummaryPrompt", prompt)
}

export const getRephrasePrompt = async () => {
    return (await getStorage("copilotRephrasePrompt")) || DEFAULT_REPHRASE_PROMPT
}

export const setRephrasePrompt = async (prompt: string) => {
    await setStorage("copilotRephrasePrompt", prompt)
}

export const getTranslatePrompt = async () => {
    return (
        (await getStorage("copilotTranslatePrompt")) || DEFAULT_TRANSLATE_PROMPT
    )
}

export const setTranslatePrompt = async (prompt: string) => {
    await setStorage("copilotTranslatePrompt", prompt)
}

export const getExplainPrompt = async () => {
    return (await getStorage("copilotExplainPrompt")) || DEFAULT_EXPLAIN_PROMPT
}

export const setExplainPrompt = async (prompt: string) => {
    await setStorage("copilotExplainPrompt", prompt)
}

export const getCustomPrompt = async () => {
    return (await getStorage("copilotCustomPrompt")) || DEFAULT_CUSTOM_PROMPT
}

export const setCustomPrompt = async (prompt: string) => {
    await setStorage("copilotCustomPrompt", prompt)
}

export const getAllCopilotPrompts = async () => {
    const [
        summaryPrompt,
        rephrasePrompt,
        translatePrompt,
        explainPrompt,
        customPrompt,
        enabledStates
    ] = await Promise.all([
        getSummaryPrompt(),
        getRephrasePrompt(),
        getTranslatePrompt(),
        getExplainPrompt(),
        getCustomPrompt(),
        getCopilotPromptsEnabledState()
    ])

    return [
        { key: "summary", prompt: summaryPrompt, enabled: enabledStates.summary },
        { key: "rephrase", prompt: rephrasePrompt, enabled: enabledStates.rephrase },
        { key: "translate", prompt: translatePrompt, enabled: enabledStates.translate },
        { key: "explain", prompt: explainPrompt, enabled: enabledStates.explain },
        { key: "custom", prompt: customPrompt, enabled: enabledStates.custom }
    ]
}

export const getCopilotPromptsEnabledState = async () => {
    const state = await getStorage<Record<string, boolean>>("copilotPromptsEnabled")
    return state || {
        summary: true,
        rephrase: true,
        translate: true,
        explain: true,
        custom: true
    }
}

export const toggleCopilotPromptEnabled = async (key: string, enabled: boolean) => {
    const state = await getCopilotPromptsEnabledState()
    state[key] = enabled
    await setStorage("copilotPromptsEnabled", state)

    // Notify background worker to refresh context menus
    try {
        await browser.runtime.sendMessage({
            type: "refresh_builtin_copilot_menus"
        })
    } catch (e) {
        // Background worker might not be ready, ignore
    }
}

export const setAllCopilotPrompts = async (
    prompts: { key: string; prompt: string }[]
) => {
    for (const { key, prompt } of prompts) {
        switch (key) {
            case "summary":
                await setSummaryPrompt(prompt)
                break
            case "rephrase":
                await setRephrasePrompt(prompt)
                break
            case "translate":
                await setTranslatePrompt(prompt)
                break
            case "explain":
                await setExplainPrompt(prompt)
                break
            case "custom":
                await setCustomPrompt(prompt)
                break

        }
    }
}

export const getPrompt = async (key: string) => {
    // Check if it's a custom copilot prompt
    if (key.startsWith("custom_copilot_")) {
        const customPrompts = await getCustomCopilotPrompts()
        const promptId = key.replace("custom_copilot_", "")
        const customPrompt = customPrompts.find(p => p.id === promptId)
        return customPrompt?.prompt || ""
    }

    switch (key) {
        case "summary":
            return await getSummaryPrompt()
        case "rephrase":
            return await getRephrasePrompt()
        case "translate":
            return await getTranslatePrompt()
        case "explain":
            return await getExplainPrompt()
        case "custom":
            return await getCustomPrompt()
        default:
            return ""
    }
}

// Custom Copilot Prompts Management
export interface CustomCopilotPrompt {
    id: string
    title: string
    prompt: string
    enabled: boolean
    createdAt: number
}

const generateID = () => {
    return "custom_xxxx-xxxx-xxx-xxxx".replace(/[x]/g, () => {
        const r = Math.floor(Math.random() * 16)
        return r.toString(16)
    })
}

export const getCustomCopilotPrompts = async (): Promise<CustomCopilotPrompt[]> => {
    const prompts = await getStorage<CustomCopilotPrompt[]>("customCopilotPrompts")
    return prompts || []
}

export const saveCustomCopilotPrompt = async (data: {
    title: string
    prompt: string
}) => {
    const customPrompts = await getCustomCopilotPrompts()
    const newPrompt: CustomCopilotPrompt = {
        id: generateID(),
        title: data.title,
        prompt: data.prompt,
        enabled: true,
        createdAt: Date.now()
    }
    customPrompts.push(newPrompt)
    await setStorage("customCopilotPrompts", customPrompts)

    // Notify background worker to refresh context menus
    try {
        await browser.runtime.sendMessage({
            type: "refresh_custom_copilot_menus"
        })
    } catch (e) {
        // Background worker might not be ready, ignore
    }

    return newPrompt
}

export const updateCustomCopilotPrompt = async (
    id: string,
    data: Partial<Omit<CustomCopilotPrompt, "id" | "createdAt">>
) => {
    const customPrompts = await getCustomCopilotPrompts()
    const index = customPrompts.findIndex(p => p.id === id)
    if (index !== -1) {
        customPrompts[index] = {
            ...customPrompts[index],
            ...data
        }
        await setStorage("customCopilotPrompts", customPrompts)

        // Notify background worker to refresh context menus
        try {
            await browser.runtime.sendMessage({
                type: "refresh_custom_copilot_menus"
            })
        } catch (e) {
            // Background worker might not be ready, ignore
        }

        return customPrompts[index]
    }
    return null
}

export const deleteCustomCopilotPrompt = async (id: string) => {
    const customPrompts = await getCustomCopilotPrompts()
    const filtered = customPrompts.filter(p => p.id !== id)
    await setStorage("customCopilotPrompts", filtered)

    // Notify background worker to refresh context menus
    try {
        await browser.runtime.sendMessage({
            type: "refresh_custom_copilot_menus"
        })
    } catch (e) {
        // Background worker might not be ready, ignore
    }

    return id
}

export const toggleCustomCopilotPrompt = async (id: string, enabled: boolean) => {
    return await updateCustomCopilotPrompt(id, { enabled })
}
