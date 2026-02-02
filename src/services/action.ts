import { getStorage } from "@/services/storage"


export const getInitialConfig = async () => {
    const actionIconClickValue = await getStorage("actionIconClick")
    const contextMenuClickValue = await getStorage("contextMenuClick")

    let actionIconClick = actionIconClickValue || "webui"
    let contextMenuClick = contextMenuClickValue || "sidePanel"

    return {
        actionIconClick,
        contextMenuClick
    }

}

export const getActionIconClick = async () => {
    const actionIconClickValue = await getStorage("actionIconClick")
    return actionIconClickValue || "webui"
}
