import { create } from 'zustand'
import { WatchStore } from './watchStore.types'
import { getWithdrawal } from './watchStore.api'

export const useWatchStore = create<WatchStore>((set, get) => ({
  withdrawals: [],

  currentWithdrawal: null,

  addWithdrawal: (w) => {
    set((state) => ({ withdrawals: [...state.withdrawals, w] }))
  },

  getById: async (id: string) => {
    const existing = get().currentWithdrawal
    if (existing && existing.id === id) {
      return existing
    }

    try {
      const res = await getWithdrawal({ id })
      set({ currentWithdrawal: res })
      return res
    } catch (err) {
      set({ currentWithdrawal: null })
      return null
    }
  },
}))
