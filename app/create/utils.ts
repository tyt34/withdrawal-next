/**
 * Форматирует строковое значение числа, оставляя не более двух десятичных знаков.
 * - Разрешает только цифры и точку.
 * - Если есть десятичная часть, обрезает её до двух знаков.
 * - Целые числа возвращает без изменений.
 *
 * Пример:
 *   "123.456" -> "123.45"
 *   "78"      -> "78"
 *   "12a34"   -> "12a34" (невалидный ввод остаётся без изменений)
 */
export function formatAmountTwoDecimals(value: string): string {
  // Разрешаем только цифры и точку
  if (!/^\d*\.?\d*$/.test(value)) {
    return value
  }

  if (value.includes('.')) {
    const [intPart, decPart] = value.split('.')
    return intPart + '.' + decPart.slice(0, 2)
  }

  return value
}
