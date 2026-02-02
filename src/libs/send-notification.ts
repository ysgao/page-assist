import { getStorage } from "@/services/storage"
import { browser } from "wxt/browser"

export const sendNotification = async (title: string, message: string) => {
  try {
    const sendNotificationAfterIndexing = await getStorage<boolean>(
      "sendNotificationAfterIndexing"
    )
    if (sendNotificationAfterIndexing) {
      browser.notifications.create({
        type: "basic",
        iconUrl: browser.runtime.getURL("/icon/128.png" as any),
        title,
        message
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export const sendEmbeddingCompleteNotification = async () => {
  await sendNotification(
    "Page Assist - Embedding Completed",
    "The knowledge base embedding process is complete. You can now use the knowledge base for chatting."
  )
}
