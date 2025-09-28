import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routesConfig } from './providers/ConfigRoute'
import { iosTheme } from './providers/material/ios-theme'
import { ThemeProvider, CssBaseline } from '@mui/material'

const router = createBrowserRouter(routesConfig, {
  basename: import.meta.env.PROD ? '/Bolvan-gym-diary' : '/',
})
function App() {
  return (
    <ThemeProvider theme={iosTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
