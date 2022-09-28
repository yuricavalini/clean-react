import React from 'react'
import Styles from './spinner-styles.scss'

type Props = React.HTMLAttributes<HTMLElement>

/* eslint-disable react/prop-types */
const Spinner: React.FC<Props> = (props: Props) => {
  return (
    <div {...props} aria-label="loading-spinner" className={[Styles.spinner, props.className].join(' ')}>
      <div /><div /><div /><div />
    </div>
  )
}

export default Spinner
