import { create } from 'zustand'
import { CheckIsValid, WithdrawalState } from './createStore.types'
import { createWithdrawal } from './createStore.api'
import { generateId } from './createStore.utils'
import { getWithdrawal } from 'stores/watchStore/watchStore.api'
import { ApiError } from 'lib/api-client'
import { CREATE_ERROR } from './createStore.constants'

export const useCreateStore = create<WithdrawalState>((set, get) => ({
  data: {
    amount: '',
    destination: '',
  },

  meta: {
    confirm: false,
    isSubmitting: false,
    error: null,
  },

  isValid: false,

  lastCreated: null,

  setField: (key, value) => {
    set((state) => {
      const newData = { ...state.data, [key]: value }

      const newIsValid = get().checkIsValid({ dataValue: newData })

      return {
        data: newData,
        isValid: newIsValid,
      }
    })
  },

  setConfirm: (value) => {
    set((state) => {
      const newMeta = { ...state.meta, confirm: value }

      // используем функцию checkIsValid
      const newIsValid = get().checkIsValid({ metaValue: newMeta })

      return {
        meta: newMeta,
        isValid: newIsValid,
      }
    })
  },

  submit: async () => {
    const { data, meta } = get()

    if (+data.amount <= 0 || !data.destination.trim() || !meta.confirm) {
      return
    }

    set((state) => ({
      meta: { ...state.meta, isSubmitting: true, error: null },
      lastCreated: null,
    }))

    try {
      const { id } = await createWithdrawal({
        amount: data.amount,
        destination: data.destination,
        idempotencyKey: generateId(),
      })

      const withdrawal = await getWithdrawal({ id })

      // успех — сбрасываем форму
      set({
        data: { amount: '', destination: '' },
        meta: { confirm: false, isSubmitting: false, error: null },
        lastCreated: withdrawal,
        isValid: false,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          set((state) => ({
            meta: {
              ...state.meta,
              isSubmitting: false,
              error: CREATE_ERROR[409],
            },
          }))
          return
        }

        console.error('API error', error)
        set((state) => ({
          meta: {
            ...state.meta,
            isSubmitting: false,
            error: 'Server error. Please try again.',
          },
        }))
        return
      }

      // network error — оставляем форму, показываем сообщение, разрешаем retry
      console.error('Network error', error)
      set((state) => ({
        meta: {
          ...state.meta,
          isSubmitting: false,
          error: 'Network error. Please retry.',
        },
      }))
    }
  },

  reset: () => {
    set({
      data: {
        amount: '',
        destination: '',
      },
      meta: {
        confirm: false,
        isSubmitting: false,
        error: null,
      },
    })
  },

  checkIsValid: (info: CheckIsValid) => {
    const data = info.dataValue ?? get().data
    const meta = info.metaValue ?? get().meta

    const isAmount = +data.amount > 0
    const isDestination = data.destination.trim() !== ''
    const isConfirm = meta.confirm

    return isAmount && isDestination && isConfirm
  },
}))
