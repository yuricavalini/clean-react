import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/login-context'
import { LoginStateContext } from '@/presentation/pages/login/login'

import Styles from './form-status-styles.scss'

import Spinner from '../spinner/spinner'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context) as LoginStateContext

  return (
    <div aria-label="error-wrap" className={Styles.errorWrap}>
      {state.isLoading && <Spinner className={Styles.spinner} />}
      {state.mainError && <span aria-label="main-error" className={Styles.error}>{state.mainError}</span>}
    </div>
  )
}

export default FormStatus
