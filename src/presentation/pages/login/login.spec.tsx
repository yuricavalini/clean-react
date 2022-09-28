import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Login from './login'
import { ValidationStub } from '@/presentation/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.random.words()
  render(<Login validation={validationStub} />)

  return {
    validationStub
  }
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const { validationStub } = makeSut()

    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    expect(errorWrap).toBeEmptyDOMElement()

    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    expect(submitButton).toBeDisabled()

    const emailStatus = screen.getByRole('generic', { name: 'email-status' })
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = screen.getByRole('generic', { name: 'password-status' })
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show email error if Validation fails', () => {
    const { validationStub } = makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/ })
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = screen.getByRole('generic', { name: /email-status/ })
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { validationStub } = makeSut()
    validationStub.errorMessage = ''
    const emailInput = screen.getByRole('textbox', { name: /email/ })
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = screen.getByRole('generic', { name: /email-status/ })
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('🟢')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { validationStub } = makeSut()
    validationStub.errorMessage = ''
    /**
     * Testing-library fails to query input[type='password'] when using getByRole method.
     * This is a workaround when not using a label.
     */
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = screen.getByRole('generic', { name: /password-status/ })
    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('🟢')
  })
})
