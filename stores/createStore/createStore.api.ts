import { apiRequest } from 'lib/api-client'
import { CreateWithdrawalRequest, CreateWithdrawalResponse } from './createStore.types'

export const API_CREATE = {
  POST: '/v1/withdrawals',
}

export async function createWithdrawal(data: CreateWithdrawalRequest) {
  return apiRequest<CreateWithdrawalRequest, CreateWithdrawalResponse>({
    method: 'POST',
    url: API_CREATE.POST,
    data,
    headers: {
      'Idempotency-Key': data.idempotencyKey,
    },
  })
}
