export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Базовый URL для API:
// - В development оставляем пустым, чтобы MSW перехватывал запросы
// - В production берем из переменной окружения или дефолтного URL
const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? ''
    : process.env.NEXT_PUBLIC_API_URL || 'https://api.backend.ru'

// Опции для запроса к API
interface ApiRequestOptions<TData = unknown> {
  method?: 'GET' | 'POST'
  url: string
  data?: TData
  headers?: Record<string, string>
}

// Универсальная функция для запросов к API
export async function apiRequest<TData = unknown, R = unknown>(
  options: ApiRequestOptions<TData>,
): Promise<R> {
  const { method = 'GET', url, data, headers } = options

  const response = await fetch(BASE_URL + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })

  // Если сервер вернул ошибку, выбрасываем кастомный ApiError
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }

  return response.json() as Promise<R>
}
