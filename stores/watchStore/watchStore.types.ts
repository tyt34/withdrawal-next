import { WithdrawalItem } from 'stores/createStore/createStore.types'

export type StatusType = 'pending' | 'approved' | 'failed'

export interface GetWithdrawalResponse extends WithdrawalItem {
  id: string
  status: StatusType
}

export type WatchStore = {
  currentWithdrawal: GetWithdrawalResponse | null
  withdrawals: GetWithdrawalResponse[]
  addWithdrawal: (w: GetWithdrawalResponse) => void
  getById: (id: string) => Promise<GetWithdrawalResponse | null>
}
