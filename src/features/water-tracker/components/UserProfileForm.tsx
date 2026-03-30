import React, { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material'

interface Props {
  onProfileSet: (weight: number) => void
}

export const UserProfileForm: React.FC<Props> = ({ onProfileSet }) => {
  const [weight, setWeight] = useState('')
  const [error, setError] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const validateWeight = (value: string): string => {
    if (!value.trim()) {
      return 'Введите ваш вес'
    }

    const weightNum = parseFloat(value)

    if (isNaN(weightNum)) {
      return 'Введите корректное число'
    }

    if (weightNum < 40) {
      return 'Вес должен быть не менее 40 кг'
    }

    if (weightNum > 300) {
      return 'Вес должен быть не более 300 кг'
    }

    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateWeight(weight)

    if (validationError) {
      setError(validationError)
      setShowAlert(true)
      return
    }

    onProfileSet(parseFloat(weight))
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWeight(value)

    // Валидация в реальном времени (опционально)
    const validationError = validateWeight(value)
    setError(validationError)
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  const calculatedGoal =
    weight && !error ? Math.round(parseFloat(weight) * 30) : 0

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        background: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Настройка профиля
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Рассчитаем вашу суточную норму воды (30 мл на 1 кг веса)
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="number"
          label="Ваш вес (кг)"
          value={weight}
          onChange={handleWeightChange}
          // Убираем HTML5 валидацию, чтобы не было браузерных сообщений
          inputProps={{ step: 0.1 }}
          error={!!error}
          helperText={error ? ' ' : 'Диапазон: 40-300 кг'} // Пустой текст при ошибке, чтобы не дублировать
          sx={{ mb: 2 }}
        />

        {weight && !error && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ваша суточная норма: {calculatedGoal} мл
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ background: '#007AFF', '&:hover': { background: '#0056CC' } }}
        >
          Сохранить
        </Button>
      </form>

      {/* Кастомное уведомление об ошибке */}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
