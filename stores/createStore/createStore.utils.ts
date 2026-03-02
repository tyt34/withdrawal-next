// функция для генерации случайного 4-значного id
// используются для:
// имитации создания idempotencyKey
// имитации создания id на бекенде
export const generateId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString() // от 1000 до 9999
}
