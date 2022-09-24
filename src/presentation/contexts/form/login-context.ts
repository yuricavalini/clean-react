import { createContext } from 'react'
import { LoginState } from '@/presentation/pages/login/login'

export default createContext<LoginState | null>(null)
