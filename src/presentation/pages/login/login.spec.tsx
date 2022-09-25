import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from './login'

describe('Login Component', () => {
  test('Should start with initial state', () => {
    render(<Login />)

    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    expect(errorWrap).toBeEmptyDOMElement()

    const submitButton = screen.getByRole<HTMLButtonElement>('button', { name: 'Entrar' })
    expect(submitButton).toBeDisabled()

    const emailStatus = screen.getByRole('generic', { name: 'email-status' })
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = screen.getByRole('generic', { name: 'password-status' })
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🔴')
  })
})
