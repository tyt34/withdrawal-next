'use client'

import Link from 'next/link'
import { ROUTES } from './routes'

export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-8">Withdrawal App</h1>

      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Link
          href={ROUTES.CREATE}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center"
        >
          Create Withdrawal
        </Link>

        <Link
          href={ROUTES.WATCH}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-center"
        >
          Watch Withdrawals
        </Link>
      </div>
    </div>
  )
}
