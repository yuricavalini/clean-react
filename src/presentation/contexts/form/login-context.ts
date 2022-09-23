import { createContext } from 'react'

export interface LoginContext {
  isLoading: boolean
  errorMessage: string
}

export default createContext<LoginContext | null>(null)
