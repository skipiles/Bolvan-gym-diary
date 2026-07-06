import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(email, password)

      if (result.error) {
        // Приводим error к типу с полем message
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result.error as any)?.message || 'Ошибка входа'
        setError(errorMessage)
        setLoading(false)
      } else {
        navigate('/')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Произошла ошибка при входе')
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Вход
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              background: '#FF3B30',
              '&:hover': { background: '#D63027' },
              py: 1.5,
              borderRadius: '12px',
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Нет аккаунта?{' '}
            <Link href="#/register" sx={{ color: '#FF3B30' }}>
              Зарегистрироваться
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
