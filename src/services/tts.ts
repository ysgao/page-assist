
const DEFAULT_TTS_PROVIDER = "browser"

const AVAILABLE_TTS_PROVIDERS = ["browser", "elevenlabs"] as const

export const getTTSProvider = async (): Promise<
  (typeof AVAILABLE_TTS_PROVIDERS)[number]
> => {
  const ttsProvider = await getStorage("ttsProvider")
  if (!ttsProvider || ttsProvider.length === 0) {
    return DEFAULT_TTS_PROVIDER
  }
  return ttsProvider as (typeof AVAILABLE_TTS_PROVIDERS)[number]
}

export const setTTSProvider = async (ttsProvider: string) => {
  await setStorage("ttsProvider", ttsProvider)
}

export const getBrowserTTSVoices = async () => {
  if (import.meta.env.BROWSER === "chrome" || import.meta.env.BROWSER === "edge") {
    const tts = await chrome.tts.getVoices()
    return tts
  } else {
    const tts = await speechSynthesis.getVoices()
    return tts.map((voice) => ({
      voiceName: voice.name,
      lang: voice.lang
    }))
  }
}

export const getVoice = async () => {
  const voice = await getStorage("voice")
  return voice
}

export const setVoice = async (voice: string) => {
  await setStorage("voice", voice)
}

export const isTTSEnabled = async () => {
  const data = await getStorage("isTTSEnabled")
  if (!data || data.length === 0) {
    return true
  }
  return data === "true"
}

export const setTTSEnabled = async (isTTSEnabled: boolean) => {
  await setStorage("isTTSEnabled", isTTSEnabled.toString())
}

export const isSSMLEnabled = async () => {
  const data = await getStorage("isSSMLEnabled")
  return data === "true"
}

export const setSSMLEnabled = async (isSSMLEnabled: boolean) => {
  await setStorage("isSSMLEnabled", isSSMLEnabled.toString())
}

export const getElevenLabsApiKey = async () => {
  const data = await getStorage("elevenLabsApiKey")
  return data
}

export const setElevenLabsApiKey = async (elevenLabsApiKey: string) => {
  await setStorage("elevenLabsApiKey", elevenLabsApiKey)
}

export const getElevenLabsVoiceId = async () => {
  const data = await getStorage("elevenLabsVoiceId")
  return data
}

export const setElevenLabsVoiceId = async (elevenLabsVoiceId: string) => {
  await setStorage("elevenLabsVoiceId", elevenLabsVoiceId)
}

export const getElevenLabsModel = async () => {
  const data = await getStorage("elevenLabsModel")
  return data
}

export const setElevenLabsModel = async (elevenLabsModel: string) => {
  await setStorage("elevenLabsModel", elevenLabsModel)
}

export const getOpenAITTSBaseUrl = async () => {
  const data = await getStorage("openAITTSBaseUrl")
  if (!data || data.length === 0) {
    return "https://api.openai.com/v1"
  }
  return data
}

export const setOpenAITTSBaseUrl = async (openAITTSBaseUrl: string) => {
  await setStorage("openAITTSBaseUrl", openAITTSBaseUrl)
}

export const getOpenAITTSApiKey = async () => {
  const data = await getStorage("openAITTSApiKey")
  return data || ''
}

export const getOpenAITTSModel = async () => {
  const data = await getStorage("openAITTSModel")
  if (!data || data.length === 0) {
    return "tts-1"
  }
  return data
}

export const setOpenAITTSModel = async (openAITTSModel: string) => {
  await setStorage("openAITTSModel", openAITTSModel)
}


export const setOpenAITTSApiKey = async (openAITTSApiKey: string) => {
  await setStorage("openAITTSApiKey", openAITTSApiKey)
}

export const getOpenAITTSVoice = async () => {
  const data = await getStorage("openAITTSVoice")
  if (!data || data.length === 0) {
    return "alloy"
  }
  return data
}

export const setOpenAITTSVoice = async (openAITTSVoice: string) => {
  await setStorage("openAITTSVoice", openAITTSVoice)
}


export const getResponseSplitting = async () => {
  const data = await getStorage("ttsResponseSplitting")
  if (!data || data.length === 0 || data === "") {
    return "punctuation"
  }
  return data
}

export const getRemoveReasoningTagTTS = async () => {
  const data = await getStorage("removeReasoningTagTTS")
  if (!data || data.length === 0 || data === "") {
    return true
  }
  return data === "true"
}

export const setResponseSplitting = async (responseSplitting: string) => {
  await setStorage("ttsResponseSplitting", responseSplitting)
}

export const setRemoveReasoningTagTTS = async (removeReasoningTagTTS: boolean) => {
  await setStorage("removeReasoningTagTTS", removeReasoningTagTTS.toString())
}


export const isTTSAutoPlayEnabled = async () => {
  const data = await getStorage<boolean | undefined>("isTTSAutoPlayEnabled")
  return data || false
}

export const setTTSAutoPlayEnabled = async (isTTSAutoPlayEnabled: boolean) => {
  await setStorage("isTTSAutoPlayEnabled", isTTSAutoPlayEnabled)
}

export const getSpeechPlaybackSpeed = async () => {
  const data = await getStorage<number | undefined>("speechPlaybackSpeed")
  return data || 1
}

export const setSpeechPlaybackSpeed = async (speechPlaybackSpeed: number) => {
  await setStorage("speechPlaybackSpeed", speechPlaybackSpeed)
}

import { getStorage, setStorage } from "@/services/storage"

export const getTTSSettings = async () => {
  const [
    ttsEnabled,
    ttsProvider,
    browserTTSVoices,
    voice,
    ssmlEnabled,
    elevenLabsApiKey,
    elevenLabsVoiceId,
    elevenLabsModel,
    responseSplitting,
    removeReasoningTagTTS,
    // OPENAI
    openAITTSBaseUrl,
    openAITTSApiKey,
    openAITTSModel,
    openAITTSVoice,
    // UTILS
    ttsAutoPlay,
    playbackSpeed,
  ] = await Promise.all([
    isTTSEnabled(),
    getTTSProvider(),
    getBrowserTTSVoices(),
    getVoice(),
    isSSMLEnabled(),
    getElevenLabsApiKey(),
    getElevenLabsVoiceId(),
    getElevenLabsModel(),
    getResponseSplitting(),
    getRemoveReasoningTagTTS(),
    // OPENAI 
    getOpenAITTSBaseUrl(),
    getOpenAITTSApiKey(),
    getOpenAITTSModel(),
    getOpenAITTSVoice(),
    // UTILS
    isTTSAutoPlayEnabled(),
    getSpeechPlaybackSpeed(),
  ])

  return {
    ttsEnabled,
    ttsProvider,
    browserTTSVoices,
    voice,
    ssmlEnabled,
    elevenLabsApiKey,
    elevenLabsVoiceId,
    elevenLabsModel,
    responseSplitting,
    removeReasoningTagTTS,
    // OPENAI
    openAITTSBaseUrl,
    openAITTSApiKey,
    openAITTSModel,
    openAITTSVoice,
    ttsAutoPlay,
    playbackSpeed,
  }
}

export const setTTSSettings = async ({
  ttsEnabled,
  ttsProvider,
  voice,
  ssmlEnabled,
  elevenLabsApiKey,
  elevenLabsVoiceId,
  elevenLabsModel,
  responseSplitting,
  removeReasoningTagTTS,
  openAITTSBaseUrl,
  openAITTSApiKey,
  openAITTSModel,
  openAITTSVoice,
  ttsAutoPlay,
  playbackSpeed,
}: {
  ttsEnabled: boolean
  ttsProvider: string
  voice: string
  ssmlEnabled: boolean
  elevenLabsApiKey: string
  elevenLabsVoiceId: string
  elevenLabsModel: string
  responseSplitting: string
  removeReasoningTagTTS: boolean
  openAITTSBaseUrl: string,
  openAITTSApiKey: string,
  openAITTSModel: string,
  openAITTSVoice: string,
  ttsAutoPlay: boolean,
  playbackSpeed: number,
}) => {
  await Promise.all([
    setTTSEnabled(ttsEnabled),
    setTTSProvider(ttsProvider),
    setVoice(voice),
    setSSMLEnabled(ssmlEnabled),
    setElevenLabsApiKey(elevenLabsApiKey),
    setElevenLabsVoiceId(elevenLabsVoiceId),
    setElevenLabsModel(elevenLabsModel),
    setResponseSplitting(responseSplitting),
    setRemoveReasoningTagTTS(removeReasoningTagTTS),
    setOpenAITTSBaseUrl(openAITTSBaseUrl),
    setOpenAITTSApiKey(openAITTSApiKey),
    setOpenAITTSModel(openAITTSModel),
    setOpenAITTSVoice(openAITTSVoice),
    setTTSAutoPlayEnabled(ttsAutoPlay),
    setSpeechPlaybackSpeed(playbackSpeed),
  ])
}
