import { GetWithdrawalResponse } from 'stores/watchStore/watchStore.types'

export interface WithdrawalItem {
  amount: string
  destination: string
}

export type WithdrawalData = {
  amount: string
  destination: string
}

export type WithdrawalMeta = {
  confirm: boolean
  isSubmitting: boolean
  error: string | null
}

export type WithdrawalState = {
  data: WithdrawalData
  meta: WithdrawalMeta
  setField: <K extends keyof WithdrawalData>(key: K, value: WithdrawalData[K]) => void
  setConfirm: (value: boolean) => void
  submit: () => Promise<void>
  reset: () => void
  checkIsValid: (info: CheckIsValid) => boolean
  isValid: boolean
  lastCreated: GetWithdrawalResponse | null
}

export type CheckIsValid = {
  dataValue?: WithdrawalData
  metaValue?: WithdrawalMeta
}

export interface CreateWithdrawalRequest extends WithdrawalItem {
  idempotencyKey: string
}

// я понимаю, что тупо делать интерфейс в котором один ключ,
// но в реальности там было бы больше ключей
export interface CreateWithdrawalResponse {
  id: string
}
