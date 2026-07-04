"use client"

import { useCallback, useSyncExternalStore } from "react"

function getSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "dark")

  const toggle = useCallback(() => {
    document.documentElement.classList.toggle("dark")
  }, [])

  const setLight = useCallback(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  const setDark = useCallback(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return { theme, toggle, setLight, setDark, isDark: theme === "dark" }
}
