'use client'

import { useWatchStore } from '@stores/watchStore/watchStore'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

export default function WatchDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const currentWithdrawal = useWatchStore((state) => state.currentWithdrawal)
  const getById = useWatchStore((state) => state.getById)

  useEffect(() => {
    if (!id) {
      return
    }
    getById(id)
  }, [id])

  const statusStyles = useMemo(() => {
    if (!currentWithdrawal) {
      return ''
    }

    if (currentWithdrawal.status === 'approved') {
      return 'bg-green-100 text-green-700'
    }

    if (currentWithdrawal.status === 'failed') {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }, [currentWithdrawal])

  if (!id || Array.isArray(id)) {
    return <p>Invalid ID</p>
  }

  if (!currentWithdrawal) {
    return <p>Withdrawal not found</p>
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-2xl space-y-6">
      <button
        className="text-blue-600 hover:underline"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold">Withdrawal Detail</h1>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">ID</span>
          <span className="font-medium">{currentWithdrawal.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-medium">{currentWithdrawal.amount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Destination</span>
          <span className="font-medium">{currentWithdrawal.destination}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Status</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles}`}
          >
            {currentWithdrawal.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}
