import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/login-context'
import { LoginState } from '@/presentation/pages/login/login'

import Styles from './form-status-styles.scss'

import Spinner from '../spinner/spinner'

const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(Context) as LoginState

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      { isLoading && <Spinner className={Styles.spinner} />}
      { errorMessage && <span className={Styles.error}>{errorMessage}</span> }
    </div>
  )
}

export default FormStatus
