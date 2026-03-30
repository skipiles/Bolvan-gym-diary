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
  Stepper,
  Step,
  StepLabel,
  Snackbar,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const steps = ['Основная информация', 'Физические параметры']

export const Register: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleNext = () => {
    if (activeStep === 0) {
      if (!email || !password || !username) {
        setError('Заполните все обязательные поля')
        return
      }
      if (password.length < 6) {
        setError('Пароль должен быть не менее 6 символов')
        return
      }
    }
    setError('')
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setError('')
    setActiveStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    const weightNum = weight ? parseFloat(weight) : null
    const heightNum = height ? parseFloat(height) : null
    const dailyWaterGoal = weightNum ? Math.round(weightNum * 30) : 2000

    const { error: signUpError } = await signUp(
      email,
      password,
      username,
      fullName,
      weightNum,
      heightNum,
      dailyWaterGoal,
    )

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setSuccessMessage('Регистрация успешна! Теперь вы можете войти в аккаунт.')

    setTimeout(() => {
      navigate('/login')
    }, 3000)

    setLoading(false)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: '20px', bgcolor: '#FFFFFF' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Регистрация
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box>
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
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Полное имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText="Минимум 6 символов"
              sx={{ mb: 3 }}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <TextField
              fullWidth
              label="Вес (кг)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              inputProps={{ min: 40, max: 300, step: 0.1 }}
              helperText="Необязательно, но нужно для расчета нормы воды"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Рост (см)"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              inputProps={{ min: 100, max: 250 }}
              helperText="Необязательно"
              sx={{ mb: 3 }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ color: '#8E8E93' }}
          >
            Назад
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                background: '#FF3B30',
                '&:hover': { background: '#D63027' },
                borderRadius: '10px',
                px: 3,
              }}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                background: '#FF3B30',
                '&:hover': { background: '#D63027' },
                borderRadius: '10px',
                px: 3,
              }}
            >
              Далее
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Уже есть аккаунт?{' '}
            <Link
              href="#/login"
              sx={{ color: '#FF3B30', textDecoration: 'none' }}
            >
              Войти
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          variant="filled"
          sx={{ width: '100%', bgcolor: '#34C759' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}
