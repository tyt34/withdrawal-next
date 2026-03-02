import { http, HttpResponse } from 'msw'
import { API_CREATE } from 'stores/createStore/createStore.api'
import { createMockGet, MOCK_POST } from './data'
import { API_GET } from 'stores/watchStore/watchStore.api'
import { CreateWithdrawalRequest } from 'stores/createStore/createStore.types'

export const handlers = [
  http.post(API_CREATE.POST, async ({ request }) => {
    const body = (await request.json()) as CreateWithdrawalRequest

    if (body.amount === '409') {
      return new HttpResponse(JSON.stringify({ message: 'Duplicate withdrawal' }), {
        status: 409,
      })
    }

    if (body.amount === '500') {
      return new HttpResponse(JSON.stringify({ message: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (body.amount === '400') {
      return new HttpResponse(JSON.stringify({ message: 'Bad request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new HttpResponse(JSON.stringify(MOCK_POST), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(API_GET.GET(':id'), async ({ params }) => {
    const { id } = params as { id: string }

    const mockData = createMockGet(id)

    return new HttpResponse(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]
