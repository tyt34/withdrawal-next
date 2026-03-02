import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, expect, Mock } from 'vitest'
import WithdrawalPage from './page'
import { useCreateStore } from '../../stores/createStore/createStore'

vi.mock('../../stores/createStore/createStore.ts', () => ({
  useCreateStore: vi.fn(),
}))

vi.mock('lib/db', () => ({
  getLastWithdrawal: vi
    .fn()
    .mockResolvedValue({ amount: '100', destination: 'wallet123' }),
  saveLastWithdrawal: vi.fn().mockResolvedValue(undefined),
}))

describe('WithdrawalPage', () => {
  it('prevents double submit', async () => {
    let isSubmitting = false

    const submitMock = vi.fn(async () => {
      isSubmitting = true
      await new Promise((res) => setTimeout(res, 0))
      isSubmitting = false
    })

    ;(useCreateStore as unknown as Mock).mockReturnValue({
      data: { amount: '100', destination: 'wallet123' },
      meta: {
        confirm: true,
        get isSubmitting() {
          return isSubmitting
        },
        error: null,
      },
      setField: vi.fn(),
      setConfirm: vi.fn(),
      isValid: true,
      submit: submitMock,
      lastCreated: null,
    })

    render(<WithdrawalPage />)

    const button = screen.getByRole('button', { name: /submit/i })

    // дважды "кликаем" кнопку быстро
    fireEvent.click(button)
    fireEvent.click(button)

    // Проверяем, что при быстром двойном клике submit вызывается только один раз
    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1))
  })

  it('fills form, submits and shows error', async () => {
    const submitMock = vi.fn()

    ;(useCreateStore as unknown as Mock).mockReturnValue({
      data: {
        amount: '',
        destination: '',
      },
      meta: {
        confirm: false,
        isSubmitting: false,
        error: 'Something went wrong',
      },
      isValid: true,
      lastCreated: null,
      setField: vi.fn(),
      setConfirm: vi.fn(),
      submit: submitMock,
    })

    render(<WithdrawalPage />)

    // заполняем amount
    const amountInput = screen.getByPlaceholderText('Enter amount')
    fireEvent.change(amountInput, { target: { value: '100' } })

    // заполняем destination
    const destinationInput = screen.getByPlaceholderText('Wallet / Bank / Address')
    fireEvent.change(destinationInput, { target: { value: 'wallet123' } })

    // ставим чекбокс
    const checkbox = screen.getByLabelText('I confirm this withdrawal')
    fireEvent.click(checkbox)

    // сабмитим форму
    const button = screen.getByRole('button', { name: 'Submit' })
    fireEvent.click(button)

    const errorNode = screen.getByText('Something went wrong')
    // Проверяем неуспешный сабмит
    expect(errorNode).toBeInTheDocument()
  })

  it('submits form successfully and shows lastCreated block', async () => {
    const lastCreatedMock = {
      id: '1234',
      status: 'pending',
    }

    const submitMock = vi.fn(async () => {
      return lastCreatedMock
    })

    ;(useCreateStore as unknown as Mock).mockReturnValue({
      data: { amount: '100', destination: 'wallet123' },
      meta: { confirm: true, isSubmitting: false, error: null },
      isValid: true,
      lastCreated: lastCreatedMock,
      setField: vi.fn(),
      setConfirm: vi.fn(),
      submit: submitMock,
    })

    render(<WithdrawalPage />)

    // Кликаем кнопку сабмита
    const button = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(button)

    // Ждём, чтобы submitMock вызвался
    await waitFor(() => expect(submitMock).toHaveBeenCalled())

    // Проверяем, что блок с lastCreated появился
    const idNode = screen.getByText(/1234/)
    expect(idNode).toBeInTheDocument()

    const statusNode = screen.getByText(/pending/i)
    expect(statusNode).toBeInTheDocument()

    const linkNode = screen.getByRole('link', { name: /view details/i })
    // Проверяем успешный сабмит
    expect(linkNode).toHaveAttribute('href', expect.stringContaining('1234'))
  })
})
