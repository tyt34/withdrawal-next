'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/** Флаг для предотвращения многократного запуска MSW worker */
let workerStarted = false

// Компонент-обёртка для инициализации Mock Service Worker на клиенте
export default function ClientMsw({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      // В production mode не используем MSW, сразу рендерим детей
      if (process.env.NODE_ENV !== 'development') {
        setReady(true)
        return
      }

      // Если worker ещё не запущен, импортируем и запускаем его
      if (!workerStarted) {
        const { worker } = await import('../mocks/browser')
        await worker.start({
          // Пропускаем запросы, которые не замоканы
          onUnhandledRequest: 'bypass',
        })
        workerStarted = true
      }

      setReady(true)
    }

    init()
  }, [])

  if (!ready) {
    return null
  }

  return <>{children}</>
}
