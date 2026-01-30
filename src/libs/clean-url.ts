// clean url ending if it with /
export const cleanUrl = (url: string) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1)
  }
  return url
}

export const getHostName = (url: string) => {
  try {
    const { hostname } = new URL(url)
    return hostname
  } catch (error) {
    return url
  }
}
