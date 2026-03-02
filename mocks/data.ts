import { CreateWithdrawalResponse } from 'stores/createStore/createStore.types'
import { generateId } from 'stores/createStore/createStore.utils'
import { GetWithdrawalResponse } from 'stores/watchStore/watchStore.types'

export const MOCK_POST: CreateWithdrawalResponse = {
  id: generateId(),
}

export const createMockGet = (id: string) => {
  return {
    amount: '1',
    destination: 'abc',
    id,
    status: 'approved',
  } as GetWithdrawalResponse
}
