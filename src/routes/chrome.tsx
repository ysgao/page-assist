import { lazy } from "react"
import { Route, Routes } from "react-router-dom"

const OptionIndex = lazy(() => import("./option-index"))
const OptionSettings = lazy(() => import("./option-settings"))
const OptionModal = lazy(() => import("./option-settings-model"))
const OptionPrompt = lazy(() => import("./option-settings-prompt"))
const OptionOllamaSettings = lazy(() => import("./options-settings-ollama"))
const OptionShare = lazy(() => import("./option-settings-share"))
const OptionKnowledgeBase = lazy(() => import("./option-settings-knowledge"))
const OptionAbout = lazy(() => import("./option-settings-about"))
const SidepanelChat = lazy(() => import("./sidepanel-chat"))
const SidepanelSettings = lazy(() => import("./sidepanel-settings"))
const OptionRagSettings = lazy(() => import("./option-rag"))
const OptionChrome = lazy(() => import("./option-settings-chrome"))
const OptionOpenAI = lazy(() => import("./option-settings-openai"))
const SidepanelSettingsOpenAI = lazy(() => import("./sidepanel-settings-openai"))
const SidepanelSettingsModel = lazy(() => import("./sidepanel-settings-model"))

export const OptionRoutingChrome = () => {
  return (
    <Routes>
      <Route path="/" element={<OptionIndex />} />
      <Route path="/settings" element={<OptionSettings />} />
      <Route path="/settings/model" element={<OptionModal />} />
      <Route path="/settings/prompt" element={<OptionPrompt />} />
      <Route path="/settings/ollama" element={<OptionOllamaSettings />} />
      <Route path="/settings/chrome" element={<OptionChrome />} />
      <Route path="/settings/openai" element={<OptionOpenAI />} />
      <Route path="/settings/share" element={<OptionShare />} />
      <Route path="/settings/knowledge" element={<OptionKnowledgeBase />} />
      <Route path="/settings/rag" element={<OptionRagSettings />} />
      <Route path="/settings/about" element={<OptionAbout />} />
    </Routes>
  )
}

export const SidepanelRoutingChrome = () => {
  return (
    <Routes>
      <Route path="/" element={<SidepanelChat />} />
      <Route path="/settings" element={<SidepanelSettings />} />
      <Route path="/settings/openai" element={<SidepanelSettingsOpenAI />} />
      <Route path="/settings/model" element={<SidepanelSettingsModel />} />
    </Routes>
  )
}
