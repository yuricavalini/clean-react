import React, { useState } from 'react'

import Styles from './login-styles.scss'

import { Footer, Input, FormStatus, LoginHeader } from '@/presentation/components'

import Context from '@/presentation/contexts/form/login-context'

export interface LoginState {
  isLoading: boolean
}
export interface LoginErrorState {
  email: string
  password: string
  main: string
}

export interface LoginStateContext {
  state: LoginState
  errorState: LoginErrorState
}

const Login: React.FC = () => {
  const [state] = useState<LoginState>({
    isLoading: false
  })
  const [errorState] = useState<LoginErrorState>({
    email: 'Campo obrigatório',
    password: 'Campo obrigatório',
    main: ''
  })

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, errorState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senha' />
          <button className={Styles.submit} disabled type="submit">Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
