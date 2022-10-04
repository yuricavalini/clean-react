import React from 'react'
import Input from './input'
import { render, RenderResult, screen } from '@testing-library/react'
import Context from '@/presentation/contexts/form/login-context'

const makeSut = (): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} as any, setState: () => ({}) }}>
      <Input name="field" />
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    makeSut()

    const input: HTMLInputElement = screen.getByRole('textbox', { name: 'field' })
    expect(input.readOnly).toBe(true)
  })
})
