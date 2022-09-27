import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Login from './login'
import { ValidationSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = faker.random.words()
  render(<Login validation={validationSpy} />)
  return {
    validationSpy
  }
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const { validationSpy } = makeSut()

    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    expect(errorWrap).toBeEmptyDOMElement()

    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    expect(submitButton).toBeDisabled()

    const emailStatus = screen.getByRole('generic', { name: 'email-status' })
    expect(emailStatus.title).toBe(validationSpy.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = screen.getByRole('generic', { name: 'password-status' })
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should call Validation with correct email', () => {
    const { validationSpy } = makeSut()

    const emailInput = screen.getByRole('textbox', { name: /email/ })
    const email = faker.internet.email()
    fireEvent.input(emailInput, { target: { value: email } })
    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('Should call Validation with correct password', () => {
    const { validationSpy } = makeSut()
    /**
     * Testing-library fails to query input[type='password'] when using getByRole method.
     * This is a workaround when not using a label.
     */
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
    const password = faker.internet.password()
    fireEvent.input(passwordInput, { target: { value: password } })
    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })

  test('Should show email error if Validation fails', () => {
    const { validationSpy } = makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/ })
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = screen.getByRole('generic', { name: /email-status/ })
    expect(emailStatus.title).toBe(validationSpy.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
  })
})
