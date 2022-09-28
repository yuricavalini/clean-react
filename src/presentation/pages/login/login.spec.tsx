import React from 'react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { fireEvent, render, screen } from '@testing-library/react'
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

const simulateValidSubmit = (email = faker.internet.email(), password = faker.internet.password()): void => {
  populateEmailField(email)
  populatePasswordField(password)
  const submitButton = screen.getByRole('button', { name: /entrar/i })
  fireEvent.click(submitButton)
}

const populateEmailField = (email = faker.internet.email()): void => {
  const emailInput = screen.getByRole('textbox', { name: /email/ })
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (password = faker.internet.email()): void => {
  /**
  * Testing-library fails to query input[type='password'] when using getByRole method.
  * This is a workaround when not using a label and also recommended in this situation. Check: https://testing-library.com/docs/queries/about/#priority
  */
  const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusforField = (fieldName: string, validationError?: string): void => {
  const emailStatus = screen.getByRole('generic', { name: `${fieldName}-status` })
  expect(emailStatus.title).toBe(validationError ?? 'Tudo certo!')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    expect(errorWrap).toBeEmptyDOMElement()

    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    expect(submitButton).toBeDisabled()

    simulateStatusforField('email', validationError)
    simulateStatusforField('password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    populateEmailField()
    simulateStatusforField('email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    populatePasswordField()
    simulateStatusforField('password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    makeSut()

    populateEmailField()
    simulateStatusforField('email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    makeSut()

    populatePasswordField()
    simulateStatusforField('password')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()

    populateEmailField()
    populatePasswordField()
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    expect(submitButton).not.toBeDisabled()
  })

  test('Should show spinner on submit', () => {
    makeSut()

    simulateValidSubmit()
    const spinner = screen.getByRole('generic', { name: /loading-spinner/i })
    expect(spinner).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', () => {
    const { authenticationSpy } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
})
