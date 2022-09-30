import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Styles from './login-styles.scss'

import { Footer, Input, FormStatus, LoginHeader } from '@/presentation/components'

import Context from '@/presentation/contexts/form/login-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

export interface LoginState {
  isLoading: boolean
  email: string
  password: string
  emailError: string
  passwordError: string
  mainError: string
}
export interface LoginStateContext {
  state: LoginState
  setState: React.Dispatch<React.SetStateAction<LoginState>>
}

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  useEffect(() => {
    setState((prevState) =>
      ({
        ...prevState,
        emailError: validation.validate('email', state.email),
        passwordError: validation.validate('password', state.password)
      }))
  }, [state.email, state.password, validation])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.emailError || state.passwordError) {
        return
      }
      setState((prevState) => ({ ...prevState, isLoading: true }))
      const account = await authentication.auth({
        email: state.email,
        password: state.password
      })
      localStorage.setItem('accessToken', account.accessToken)
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        mainError: error.message
      }))
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form aria-label="login form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <button className={Styles.submit} disabled={!!state.emailError || !!state.passwordError} type="submit">Entrar</button>
          <Link to="/signup" aria-label="Go to register page" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
