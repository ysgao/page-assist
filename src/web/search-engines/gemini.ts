import {
  getIsSimpleInternetSearch,
  totalSearchResults
} from "@/services/search"
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory"
import { PageAssistHtmlLoader } from "~/loader/html"
import {
  defaultEmbeddingModelForRag,
  getOllamaURL,
  getSelectedModel
} from "~/services/ollama"
import { pageAssistEmbeddingModel } from "@/models/embedding"
import { cleanUrl } from "~/libs/clean-url"
import { getPageAssistTextSplitter } from "@/utils/text-splitter"
import { getAllOpenAIConfig } from "@/db/dexie/openai"
import { getModelInfo } from "@/db/dexie/models"
import { fetchWithProxy } from "@/libs/fetch-proxy"

export const geminiSearch = async (query: string) => {
  const TOTAL_SEARCH_RESULTS = await totalSearchResults()
  let modelName = ""
  let geminiApiKey = ""

  // 1. Strictly look for credentials from the currently selected model
  const selectedModelId = await getSelectedModel()
  
  if (selectedModelId) {
    const modelInfo = await getModelInfo(selectedModelId)
    if (modelInfo && modelInfo.provider_id) {
       const configs = await getAllOpenAIConfig()
       const config = configs.find(c => c.id === modelInfo.provider_id)
       // Strict check: Provider must be 'gemini' (Google AI)
       if (config && config.provider === "gemini") {
          geminiApiKey = config.apiKey
          modelName = modelInfo.model_id
       }
    }
  }

  // 2. Strict Requirement: Do not fall back to "any" configured model if the selected one is not Google.
  // "The search should be using the selected model from Google AI provide."
  // If the user selected a non-Google model, we cannot fulfill the requirement to "only call the selected model".
  // However, practically, if the user is using Llama 3 but wants Google Search, we must have *some* credentials.
  // But the user said: "Should not use a different model such as gemini-1.5-flash."
  // This implies if the user *did not select* a Gemini model, this search might not be intended to work, or 
  // they expect us to find the "Google AI" provider's model that *is* selected? 
  // No, "selected model" usually means the active chat model.
  
  // If the user selects Llama 3, 'modelName' will be empty here.
  // If we strictly follow "Should not use a different model", we should error out if the selected model is not Google.
  if (!geminiApiKey || !modelName) {
    // Let's try one more thing: Maybe the user meant "The model configured in the Google AI provider settings".
    // But usually provider settings don't have a "selected model" other than what's in the chat list.
    
    // For safety and usability, if we really can't find a selected Google model, we throw an error 
    // explaining why, rather than silently defaulting to 1.5-flash which the user explicitly forbade.
    throw new Error("Gemini Search requires a Google AI model to be selected in the chat settings.")
  }

  const results = await apiGeminiSearch(geminiApiKey, query, TOTAL_SEARCH_RESULTS, modelName)
  const isSimpleMode = await getIsSimpleInternetSearch()

  if (isSimpleMode) {
    await getOllamaURL()
    return results.map((result) => {
      return {
        url: result.link,
        content: result.content
      }
    })
  }

  // Deep Search logic (fetching pages)
  const docs: any[] = []
  for (const result of results) {
    const loader = new PageAssistHtmlLoader({
      html: "",
      url: result.link
    })
    try {
      const documents = await loader.loadByURL()
      documents.forEach((doc) => {
        docs.push(doc)
      })
    } catch (e) {
      console.error(`Failed to load ${result.link}`, e)
    }
  }

  const ollamaUrl = await getOllamaURL()
  const selectedModel = await getSelectedModel()
  const embeddingModle = await defaultEmbeddingModelForRag()
  const ollamaEmbedding = await pageAssistEmbeddingModel({
    model: embeddingModle || selectedModel || "",
    baseUrl: cleanUrl(ollamaUrl)
  })

  const textSplitter = await getPageAssistTextSplitter()
  const chunks = await textSplitter.splitDocuments(docs)
  const store = new MemoryVectorStore(ollamaEmbedding)
  await store.addDocuments(chunks)

  const resultsWithEmbeddings = await store.similaritySearch(query, 3)

  const searchResult = resultsWithEmbeddings.map((result) => {
    return {
      url: result.metadata.url,
      content: result.pageContent
    }
  })

  return searchResult
}

const apiGeminiSearch = async (apiKey: string, query: string, totalResults: number, modelName: string) => {
  // Use the exact model name from the user's selection
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

  const prompt = `
  Perform a Google Search for the following query: "${query}".
  
  Return the top ${totalResults} results in a JSON format.
  The JSON should be an array of objects, where each object has:
  - "title": The title of the page
  - "link": The URL of the page
  - "content": A comprehensive summary of the page content relevant to the query.

  Do not include any other text, markdown, or explanation. return only the JSON array.
  `

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    tools: [
      {
        google_search: {}
      }
    ]
  }

  try {
    // Use fetchWithProxy to avoid CORS issues and align with app architecture
    const response = await fetchWithProxy(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
        let errorText = "";
        try {
           errorText = await response.text();
        } catch(e) { errorText = "Unknown error"; }
        console.error("Gemini API Error:", response.status, errorText);
        throw new Error(`Gemini API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json()
    const candidates = data.candidates;

    if (!candidates || candidates.length === 0) {
        return [];
    }
    
    const text = candidates[0].content.parts.map((p: any) => p.text).join("");
    
    // Improved JSON extraction:
    // 1. Try to find content within ```json [ ... ] ``` blocks
    const jsonMatch = text.match(/```json\s*(\[[\s\S]*?\])\s*```/);
    let jsonString = "";
    
    if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1].trim();
    } else {
        // 2. If no code block, try to find the first array structure [ ... ] in the text
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            jsonString = arrayMatch[0].trim();
        } else {
             // 3. Fallback: clean up potential markdown formatting if it's the whole string
             jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
        }
    }
    
    try {
        const results = JSON.parse(jsonString);
        if (Array.isArray(results)) {
            return results.slice(0, totalResults);
        }
        return [];
    } catch (e) {
        console.error("Failed to parse Gemini JSON response", text);
        return [];
    }

  } catch (error) {
    console.error("Gemini Search failed:", error)
    return []
  }
}
