import { createContext } from 'react'
import { LoginStateContext } from '@/presentation/pages/login/login'

export default createContext<LoginStateContext | null>(null)
