export const ROUTES = {
  CREATE: '/create',
  WATCH: '/watch/',
  HOME: '/',
  WATCH_ID: (id: string) => {
    return `/watch/${id}`
  },
}
