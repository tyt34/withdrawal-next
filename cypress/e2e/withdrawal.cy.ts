import { CREATE_ERROR } from '@stores/createStore/createStore.constants'
import { LAST_TEXT } from 'app/create/page'
import { ROUTES } from 'app/routes'

describe('Withdrawal Page', () => {
  beforeEach(() => {
    // Заходим на страницу
    cy.visit(ROUTES.CREATE)

    // Очищаем IndexedDB перед тестом
    cy.window().then((win) => {
      win.indexedDB.deleteDatabase('withdrawalsDB')
    })
  })

  it('should input amount and destination and save to IndexedDB', () => {
    // Вводим amount
    cy.get('input[placeholder="Enter amount"]')
      .clear()
      .type('123.45')
      .should('have.value', '123.45')

    // Вводим destination
    cy.get('input[placeholder="Wallet / Bank / Address"]')
      .clear()
      .type('0xABCDEF123456')
      .should('have.value', '0xABCDEF123456')

    // Отмечаем чекбокс
    cy.get('input#confirm').check().should('be.checked')

    // Сабмитим форму
    cy.get('button[type="submit"]').click()

    // Ждём появления блока последней заявки
    cy.contains(LAST_TEXT).should('exist')
  })

  it('should input amount and destination and save to IndexedDB', () => {
    // Вводим amount
    cy.get('input[placeholder="Enter amount"]')
      .clear()
      .type('409')
      .should('have.value', '409')

    // Вводим destination
    cy.get('input[placeholder="Wallet / Bank / Address"]')
      .clear()
      .type('0xABCDEF123456')
      .should('have.value', '0xABCDEF123456')

    // Отмечаем чекбокс
    cy.get('input#confirm').check().should('be.checked')

    // Сабмитим форму
    cy.get('button[type="submit"]').click()

    cy.get('p[qa-attr="status-error"]')
      .should('exist')
      .and('have.text', CREATE_ERROR[409])
  })
})
