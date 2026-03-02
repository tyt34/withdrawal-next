'use client'

import { useWatchStore } from '@stores/watchStore/watchStore'
import { ROUTES } from 'app/routes'
import Link from 'next/link'

export default function WatchPage() {
  const { withdrawals } = useWatchStore()

  if (withdrawals.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No withdrawals
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {withdrawals.map((el) => (
        <Link
          key={el.id}
          href={ROUTES.WATCH_ID(el.id)}
          className="block p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition"
        >
          <div className="font-semibold">Withdrawal #{el.id}</div>
          <div className="text-sm text-gray-600">
            Amount: {el.amount} USDT | Destination: {el.destination}
          </div>
        </Link>
      ))}
    </div>
  )
}
