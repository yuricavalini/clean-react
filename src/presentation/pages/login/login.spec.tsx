import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError ?? ''
  render(<Login validation={validationStub} authentication={authenticationSpy} />)

  return {
    authenticationSpy
  }
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    expect(errorWrap).toBeEmptyDOMElement()

    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    expect(submitButton).toBeDisabled()

    const emailStatus = screen.getByRole('generic', { name: 'email-status' })
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = screen.getByRole('generic', { name: 'password-status' })
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const emailInput = screen.getByRole('textbox', { name: /email/ })
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = screen.getByRole('generic', { name: /email-status/ })
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = screen.getByRole('generic', { name: /email-status/ })
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show valid email state if Validation succeeds', () => {
    makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/ })
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = screen.getByRole('generic', { name: /email-status/ })
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('🟢')
  })

  test('Should show valid password state if Validation succeeds', () => {
    makeSut()
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

  test('Should enable submit button if form is valid', () => {
    makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/ })
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    /**
    * Testing-library fails to query input[type='password'] when using getByRole method.
    * This is a workaround when not using a label.
    */
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    expect(submitButton).not.toBeDisabled()
  })

  test('Should show spinner on submit', () => {
    makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/ })
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    /**
    * Testing-library fails to query input[type='password'] when using getByRole method.
    * This is a workaround when not using a label.
    */
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)
    const spinner = screen.getByRole('generic', { name: /loading-spinner/i })
    expect(spinner).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', () => {
    const { authenticationSpy } = makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/ })
    const email = faker.internet.email()
    fireEvent.input(emailInput, { target: { value: email } })
    /**
    * Testing-library fails to query input[type='password'] when using getByRole method.
    * This is a workaround when not using a label.
    */
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
    const password = faker.internet.password()
    fireEvent.input(passwordInput, { target: { value: password } })
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
})
