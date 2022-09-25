/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/login-context'
import { LoginErrorState, LoginStateContext } from '@/presentation/pages/login/login'

import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(Context) as LoginStateContext
  const error = errorState[props.name as keyof LoginErrorState]
  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  const getStatus = (): string => {
    return '🔴'
  }
  const getTitle = (): string => {
    return error
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...props} readOnly onFocus={enableInput} />
      <span aria-label={`${props.name ?? 'no'}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input
