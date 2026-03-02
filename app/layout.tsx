import { ReactNode } from 'react'
import Link from 'next/link'
import './globals.css'
import ClientMsw from './clientMsw'
import { ROUTES } from './routes'

export const metadata = {
  title: 'Withdrawal',
  description: 'Withdrawal is very interesting testing zadanie',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen m-0 p-0 bg-gray-50 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <Link href={ROUTES.HOME}>
            <h1 className="text-xl font-semibold cursor-pointer hover:text-blue-600 transition">
              Withdrawal App
            </h1>
          </Link>
        </header>

        <ClientMsw>
          <main className="flex-1 flex items-center justify-center">{children}</main>
        </ClientMsw>
      </body>
    </html>
  )
}
