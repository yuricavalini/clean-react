import React from 'react'
import Input from './input'
import { render, screen } from '@testing-library/react'
import Context from '@/presentation/contexts/form/login-context'

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    render(
      <Context.Provider value={{ state: {} as any, setState: () => ({}) }}>
        <Input name="field" />
      </Context.Provider>
    )

    const input: HTMLInputElement = screen.getByRole('textbox', { name: 'field' })
    expect(input.readOnly).toBe(true)
  })
})
