import React from 'react'
import Input from './input'
import { render, RenderResult, screen } from '@testing-library/react'
import Context from '@/presentation/contexts/form/login-context'
import { faker } from '@faker-js/faker'

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} as any, setState: () => ({}) }}>
      <Input name={fieldName} />
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const field = faker.database.column()
    makeSut(field)

    const input: HTMLInputElement = screen.getByRole('textbox', { name: field })
    expect(input.readOnly).toBe(true)
  })

  test('Should remove readOnly on focus', () => {
    const field = faker.database.column()
    makeSut(field)

    const input: HTMLInputElement = screen.getByRole('textbox', { name: field })
    input.focus()
    expect(input.readOnly).toBe(false)
  })
})
