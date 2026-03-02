import { apiRequest } from 'lib/api-client'
import { CreateWithdrawalResponse } from 'stores/createStore/createStore.types'
import { GetWithdrawalResponse } from './watchStore.types'

export const API_GET = {
  GET: (id: string) => {
    return `/v1/withdrawals/${id}`
  },
}

export async function getWithdrawal(value: CreateWithdrawalResponse) {
  return apiRequest<never, GetWithdrawalResponse>({
    method: 'GET',
    url: API_GET.GET(value.id),
  })
}
