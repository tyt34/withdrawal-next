import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export function startWorker() {
  if (typeof window !== 'undefined') {
    return worker.start({
      onUnhandledRequest: 'error',
    })
  }
}
