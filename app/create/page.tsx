'use client'

import { ChangeEvent, SyntheticEvent, useEffect } from 'react'
import { formatAmountTwoDecimals } from './utils'
import { getLastWithdrawal, saveLastWithdrawal } from 'lib/db'
import { ROUTES } from 'app/routes'
import { useCreateStore } from '@stores/createStore/createStore'
import Link from 'next/link'

export const LAST_TEXT = 'Last Created Withdrawal'

export default function WithdrawalPage() {
  const { data, meta, setField, setConfirm, submit, isValid, lastCreated } =
    useCreateStore()

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isValid === true && meta.isSubmitting === false) {
      await submit()

      await saveLastWithdrawal({ amount: '', destination: '' })
    }
  }

  /** Обновление суммы вывода и сохранение состояния в IndexedDB */
  const handleAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const formatted = formatAmountTwoDecimals(value)
    setField('amount', formatted)

    await saveLastWithdrawal({
      ...data,
      amount: value,
    })
  }

  /** Обновление адреса назначения и сохранение состояния в IndexedDB */
  const handleDestinationChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setField('destination', value)

    await saveLastWithdrawal({
      ...data,
      destination: value,
    })
  }

  useEffect(() => {
    // Загружаем последнюю заявку при монтировании страницы
    async function load() {
      const last = await getLastWithdrawal()
      if (last) {
        setField('amount', last.amount)
        setField('destination', last.destination)
      }
    }
    load()
  }, [])

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
      <h1 className="text-2xl font-semibold mb-6">Withdrawal</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Amount (USDT)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={data.amount}
            onChange={handleAmountChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            type="text"
            value={data.destination}
            onChange={handleDestinationChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Wallet / Bank / Address"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="confirm"
            type="checkbox"
            checked={meta.confirm}
            onChange={(e) => {
              setConfirm(e.target.checked)
            }}
            className="h-4 w-4"
          />
          <label
            htmlFor="confirm"
            className="text-sm"
          >
            I confirm this withdrawal
          </label>
        </div>

        {meta.error !== null && (
          <p
            qa-attr="status-error"
            className="text-sm text-red-600"
          >
            {meta.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isValid === false || meta.isSubmitting === true}
          className={`w-full py-2 rounded-lg text-white transition ${
            isValid === false || meta.isSubmitting === true
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {meta.isSubmitting === true ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {/* Блок последней созданной заявки */}
      {lastCreated && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">{LAST_TEXT}</h2>
          <p>
            <strong>ID:</strong> {lastCreated.id}
          </p>
          <p>
            <strong>Status:</strong> {lastCreated.status}
          </p>
          <Link
            href={ROUTES.WATCH_ID(lastCreated.id)}
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  )
}
