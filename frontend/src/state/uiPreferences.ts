import { create } from 'zustand'

type UiPreferences = {
  compactSpacing: boolean
  setCompactSpacing: (compactSpacing: boolean) => void
}

export const useUiPreferences = create<UiPreferences>((set) => ({
  compactSpacing: false,
  setCompactSpacing: (compactSpacing) => set({ compactSpacing }),
}))
