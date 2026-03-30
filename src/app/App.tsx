import { createHashRouter, RouterProvider } from 'react-router-dom'
import { routesConfig } from './providers/ConfigRoute'
import { iosTheme } from './providers/material/ios-theme'
import { ThemeProvider, CssBaseline } from '@mui/material'

const router = createHashRouter(routesConfig)

function App() {
  return (
    <ThemeProvider theme={iosTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
