import React from 'react'
import { render, screen } from '@testing-library/react'
import Login from './login'

describe('Login Component', () => {
  test('Should start with initial state', () => {
    render(<Login />)
    const errorWrap = screen.getByRole('generic', { name: 'error-wrap' })
    expect(errorWrap.childElementCount).toBe(0)
    const submitBurron = screen.getByRole<HTMLButtonElement>('button', { name: 'Entrar' })
    expect(submitBurron.disabled).toBe(true)
  })
})
