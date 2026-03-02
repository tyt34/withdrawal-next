import { WithdrawalData } from '@stores/createStore/createStore.types'
import { openDB } from 'idb'

const DB_NAME = 'withdrawalsDB'
const STORE_NAME = 'lastWithdrawal'

const TIME = 5 * 60 * 1000
// const TIME = 5000

/** Получаем или создаем базу IndexedDB */
export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
}

/** Сохраняем последнюю операцию вывода с текущим timestamp */
export async function saveLastWithdrawal(withdrawal: WithdrawalData) {
  const db = await getDB()
  await db.put(STORE_NAME, { withdrawal, timestamp: Date.now() }, 'latest')
}

/** Получаем последнюю операцию вывода, если она не устарела */
export async function getLastWithdrawal(maxAgeMs = TIME) {
  const db = await getDB()
  const record = await db.get(STORE_NAME, 'latest')

  if (!record) {
    return null
  }

  const { withdrawal, timestamp } = record

  if (Date.now() - timestamp > maxAgeMs) {
    await db.delete(STORE_NAME, 'latest')
    return null
  }

  return withdrawal
}
