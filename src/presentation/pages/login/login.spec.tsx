import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import 'jest-localstorage-mock'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import { faker } from '@faker-js/faker'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  user: UserEvent
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError ?? ''
  const user = userEvent.setup()
  render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  )

  return {
    authenticationSpy,
    user
  }
}

const simulateValidSubmit = async (userEvent: UserEvent, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  await populateEmailField(userEvent, email)
  await populatePasswordField(userEvent, password)
  const form = screen.getByRole('form', { name: /login form/ })
  fireEvent.submit(form)
  await waitFor(() => form)
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

const testStatusforField = (fieldName: string, validationError?: string): void => {
  const emailStatus = screen.getByRole('generic', { name: `${fieldName}-status` })
  expect(emailStatus.title).toBe(validationError ?? 'Tudo certo!')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    expect(errorWrap).toBeEmptyDOMElement()

    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    expect(submitButton).toBeDisabled()

    testStatusforField('email', validationError)
    testStatusforField('password', validationError)
  })

  test('Should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { user } = makeSut({ validationError })

    await populateEmailField(user)
    testStatusforField('email', validationError)
  })

  test('Should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { user } = makeSut({ validationError })

    await populatePasswordField(user)
    testStatusforField('password', validationError)
  })

  test('Should show valid email state if Validation succeeds', async () => {
    const { user } = makeSut()

    await populateEmailField(user)
    testStatusforField('email')
  })

  test('Should show valid password state if Validation succeeds', async () => {
    const { user } = makeSut()

    await populatePasswordField(user)
    testStatusforField('password')
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

    await waitFor(async () => await simulateValidSubmit(user))
    const spinner = screen.getByRole('generic', { name: /loading-spinner/i })
    expect(spinner).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', async () => {
    const { authenticationSpy, user } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()
    await waitFor(async () => await simulateValidSubmit(user, email, password))
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', async () => {
    const { authenticationSpy, user } = makeSut()

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.dblClick(submitButton)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { authenticationSpy, user } = makeSut({ validationError })

    await populateEmailField(user)
    const form = screen.getByRole('form', { name: /login form/ })
    fireEvent.submit(form)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy, user } = makeSut()

    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await waitFor(async () => await simulateValidSubmit(user))
    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    await waitFor(() => {
      expect(within(errorWrap).getAllByRole('generic')).toHaveLength(1)
    })

    const mainError = screen.getByRole('generic', { name: 'main-error' })
    expect(errorWrap).toContainElement(mainError)
    expect(mainError.textContent).toBe(error.message)
  })

  test('Should add accessToken to localstorage on success', async () => {
    const { authenticationSpy, user } = makeSut()

    await waitFor(async () => await simulateValidSubmit(user))
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    expect(history).toHaveLength(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Should go to signup page', async () => {
    const { user } = makeSut()

    const register = screen.getByRole('link', { name: /Go to register page/ })
    await user.click(register)
    expect(history).toHaveLength(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
