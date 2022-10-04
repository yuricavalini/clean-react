/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/login-context'
import { LoginState, LoginStateContext } from '@/presentation/pages/login/login'

import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context) as LoginStateContext
  const error = state[`${props?.name ?? 'default'}Error` as keyof Omit<LoginState, 'isLoading'>]

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  const getStatus = (): string => {
    return error ? '🔴' : '🟢'
  }
  const getTitle = (): string => {
    return error || 'Tudo certo!'
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...props} readOnly onFocus={enableInput} aria-label={props.name} onChange={handleChange} />
      <span aria-label={`${props?.name ?? 'no'}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input
