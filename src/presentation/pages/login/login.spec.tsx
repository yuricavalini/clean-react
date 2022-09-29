import React from 'react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserEvent, UserEventApi } from '@testing-library/user-event/dist/types/setup/setup'
import { faker } from '@faker-js/faker'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  user: UserEvent
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError ?? ''
  const user = userEvent.setup()
  render(<Login validation={validationStub} authentication={authenticationSpy} />)

  return {
    authenticationSpy,
    user
  }
}

const simulateValidSubmit = async (userEvent: UserEvent, event: keyof Pick<UserEventApi, 'click' | 'dblClick'>, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  await populateEmailField(userEvent, email)
  await populatePasswordField(userEvent, password)
  const submitButton = screen.getByRole('button', { name: /entrar/i })
  await userEvent[event](submitButton)
}

const populateEmailField = async (userEvent: UserEvent, email = faker.internet.email()): Promise<void> => {
  const emailInput = screen.getByRole('textbox', { name: /email/ })
  await userEvent.type(emailInput, email)
}

const populatePasswordField = async (userEvent: UserEvent, password = faker.internet.email()): Promise<void> => {
  /**
  * Testing-library fails to query input[type='password'] when using getByRole method.
  * This is a workaround when not using a label and also recommended in this situation. Check: https://testing-library.com/docs/queries/about/#priority
  */
  const passwordInput = screen.getByPlaceholderText(/Digite sua senha/)
  await userEvent.type(passwordInput, password)
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

  test('Should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { user } = makeSut({ validationError })

    await populateEmailField(user)
    simulateStatusforField('email', validationError)
  })

  test('Should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { user } = makeSut({ validationError })

    await populatePasswordField(user)
    simulateStatusforField('password', validationError)
  })

  test('Should show valid email state if Validation succeeds', async () => {
    const { user } = makeSut()

    await populateEmailField(user)
    simulateStatusforField('email')
  })

  test('Should show valid password state if Validation succeeds', async () => {
    const { user } = makeSut()

    await populatePasswordField(user)
    simulateStatusforField('password')
  })

  test('Should enable submit button if form is valid', async () => {
    const { user } = makeSut()

    await populateEmailField(user)
    await populatePasswordField(user)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    expect(submitButton).not.toBeDisabled()
  })

  test('Should show spinner on submit', async () => {
    const { user } = makeSut()

    await simulateValidSubmit(user, 'click')
    const spinner = screen.getByRole('generic', { name: /loading-spinner/i })
    expect(spinner).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', async () => {
    const { authenticationSpy, user } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(user, 'click', email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', async () => {
    const { authenticationSpy, user } = makeSut()

    await simulateValidSubmit(user, 'dblClick')
    expect(authenticationSpy.callsCount).toBe(1)
  })
})
