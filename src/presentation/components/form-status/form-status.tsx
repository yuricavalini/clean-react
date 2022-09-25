import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/login-context'
import { LoginStateContext } from '@/presentation/pages/login/login'

import Styles from './form-status-styles.scss'

import Spinner from '../spinner/spinner'

const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(Context) as LoginStateContext

  return (
    <div aria-label="error-wrap" className={Styles.errorWrap}>
      { state.isLoading && <Spinner className={Styles.spinner} />}
      { errorState.main && <span className={Styles.error}>{errorState.main}</span> }
    </div>
  )
}

export default FormStatus
