import React from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from '@/presentation/components'
import '@/presentation/styles/global.scss'

// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
const container = document.getElementById('main')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(<Router />)
